---
title: サイボウズのサービスを支えるログ基盤 - ゼロからの刷新とこれから
---

---
# サイボウズのサービスを<br>支えるログ基盤
: { "class": "title" }

## ゼロからの刷新とこれから

Cybozu Meetup #6, 2017-07-25

@ueokande

Cybozu Inc.

---
# $ whois

- 上岡 真也
- 2016年サイボウズ入社
- アプリケーション基盤チーム
- GitHub/Twitter: @ueokande

---
# 目次

- cybozu.comのこれまでのログ基盤
- ログ基盤のゼロからの刷新
- 新しいログ基盤のこれから

---
: { "class": "section" }

# cybozu.comの<br>これまでのログ基盤

---
: { "class": "cybozucom" }

# cybozu.com

---
# cybozu.comとは

- 2011年にスタートした、企業向けクラウドサービス
- 契約社数 20,000社以上
- ユーザ数70万人以上
- リクエスト数1.7億/day

---
# cybozu.comを支えるインフラ

- 自社製データセンター
- ホスト数（実機 + VM）: 1200程度
- ログ量
  <span style='font-weight: bold'><span style='font-size:2rem'>20億</span> 行/day</span>,
  <span style='font-weight: bold'><span style='font-size:2rem'>800</span> GB/day</span> <br>
  （毎秒平均 23,000行 くらい）

---
# なぜログが重要か

- ログはWebサービスの健康状態を示す
    - 障害対応の手がかり
- サービスの改善に役立てる
    - 性能検証
    - ユーザの行動をビジネスに利用する

---
# これまでのcybozu.comのログ基盤

1. ログを毎分ローテート
2. ローテートされたログをtarに固める
3. SSHでtarをストレージサーバーに転送
4. 転送が完了したログをホストから削除

---
# そろそろ限界...

## ログの増加にシステムが追いつかない
- スケールしたいけどできない

## 転送システムがSPOF
- 転送ホストが止まると、全体のログ転送が停止する

## ログを活用できていない
- 可視化・解析できていない、開発者以外が利用できていない

---
: { "class": "damm" }

# ちくちょう。<br>刷新だ！

Trying to crawl here by Donnie Ray Jones | <u>https://www.flickr.com/photos/donnieray/32890584381/</u>

---
: { "class": "section" }

# ログ基盤のゼロからの刷新

---
# 新ログ基盤の要件

## ① at least once

- ログを取りこぼすことなく集める

## ② 信頼性

- どこかで障害が発生しても、全体の転送が止まらない

## ③ ログを活用できる

- ログを活用できるサービスを容易に導入できる

---
# 新ログ基盤アーキテクチャ

<img style='display:block; width: 60%; height:auto; margin: 16px auto' src='images/architecture.png'>

<p class='balloon-up-right' style='left:2rem'>出力されたログは<br>Kafkaに転送</p>
<p class='balloon-up-left' style='right:2rem'>必要なサービスが<br>Kafkaからログを取り出す</p>

---
# Apache Kafkaとは

- pub/sub型の分散メッセージングシステム
- LinkedInが開発してOSS化した
- Twitter、Netflix、LINEなどの採用実績

<img style='position:absolute; width:6rem; height:auto; right:1rem; top:1rem' src="images/apache-kafka.png">
<img style='width:10rem; height:auto; position:absolute; right:2rem; bottom:2rem' src="images/kafka_diagram.png">

---
# Apache Kafkaを使う理由

## 分散メッセージングサービス

- データはレプリケーションされるので、急にノードが死んでも大丈夫
- ノードを追加することで容易にスケールできる

## pull型consumerのpub/subシステム

- データを購読する側が任意のタイミングでデータを読みだす
- 入力側・出力側が粗結合になり、それぞれ独自のタイミングで読み書きできる

---
# 各ホストからKafkaへの転送

<div style='float:right; margin-left:32px; width:14rem; background-repeat:no-repeat; height:100%; background-image: url(images/architecture.png); background-size: 150%; box-sizing: border-box;'></div>

- ログファイルの更新を監視してKafkaに送る
- ローテートされて転送が完了したログはディスクから削除

---
# Kafka clusterから各サービス

<div style='float:right; margin-left:32px; width:14rem; background-repeat:no-repeat; height:100%; background-position-x:100%; background-image:url(images/architecture.png); background-size: 150%; box-sizing: border-box;'></div>

## HBase

- ログをHadoop上に長期保存する

## Hive + Presto

- ユーザの動向をクエリで検索・解析する

## Graylog

- ログの検索、監視

---
# At least once

- システム全体で、ログを取りこぼすことなく配送
- どこかのホストが**突然の死**を遂げても、ログのデータロスが発生しない
- ログの重複は許す（≠ exactly once）

---
# At least once <sub>| Kafkaへのログ転送</sub>

<div style='float:right; margin-left:24px; width:14rem; background-repeat:no-repeat; height:100%; background-image: url(images/architecture.png); background-size: 150%; box-sizing: border-box;'></div>

- 初めはFluentdでKafkaへ転送してたが、<br>at least onceを満たすことが難しいと判明
- 転送エージェントをGoで実装
    - 状態はatomicに更新
    - ローテート後もしばらく監視

---
# At least once <sub>| Kafkaからの転送</sub>

<div style='float:right; margin-left:32px; width: 14rem; background-repeat:no-repeat; height:100%; background-position-x:100%; background-image:url(images/architecture.png); background-size: 150%; box-sizing: border-box;'></div>

- HiveやHBaseへの経路は冗長構成
- HDFS上のファイル操作もatomicに更新する必要がある

---
# 信頼性とログの活用

## 信頼性

- Kafka/Hadoopのノードが死んでも全体の転送は止まらない
- ラックの電源が落ちても大丈夫なように、同クラスタのノードはラックを分離

## ログの活用

- 用途に応じて、様々なサービスを追加できた
- 新たなサービスを追加するのに、他の箇所に影響しない

---
# 新ログ基盤の要件

## at least once

- → 電源断してもデータロスが起こらないように設計

## 信頼性

- → 冗長性をもたせたクラスタ構成とラック設計

## ログを活用できる

- → Kafkを使うことで容易にサービスを追加できる

---
# 苦労話 <sub>| 長いログの対応</sub>

- Kafkaのレコード長には上限がある
- MySQLのスローログでは1行が10MBを超えるケースもある
- Kafkaのレコードに、断片化されたログかのフラグを付与
- Kafkaからログを取り出す時、再び結合するのが少し大変

---
# 苦労話 <sub>| 転送遅延</sub>

<img style='float:right; width:12rem; margin-left:1rem' src=images/kafka-definitive-guide.jpg>

- ある日、Kafkaからの転送が大きく遅延した
- 本番環境と同じ環境を開発環境に構成してたため、早期に気付けた
- Kafkaのパラメータチューニングして解決

---
# 苦労話 <sub>| journaldに悩まされる</sub>

- アプリケーションのログをjournaldに集める計画もあった
- 社内でjournaldを導入してみたらいろいろ問題が
    - 長いログの行が勝手に分割される
    - Disk Full時にjournaldが死亡する
- 結局ファイル最強だった

<img style='float:right; width:17rem; position:absolute; right:2rem; bottom:1rem' src=images/systemd-pr.png>

---
: { "class": "section" }

# 新しいログ基盤のこれから

---
# これからやっていきたいこと

## より良い製品づくりに役立てる

- ユーザデータを可視化・解析して製品改善に役立てる
- 必要なログやデータを組合せて、障害調査を加速させる

## 開発者以外も広く利用できる環境

- エンジニア以外もログを利用できる環境の用意
- ユーザへのサポートやマーケティングを効率化させる

---
# まとめ

- サイボウズのログ基盤が新しくなりました
- Kafka導入で「at least once」「信頼性」「ログを活用できる仕組み」を実現
- これからもログをどんどん活かして、より良い製品づくりに役立てます
