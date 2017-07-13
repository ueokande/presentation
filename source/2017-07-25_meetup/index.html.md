---
title: サイボウズのサービスを支えるログ基盤 - ゼロからの刷新とこれから
---

--- { "class": "title" }
# サイボウズのサービスを<br>支えるログ基盤

## ゼロからの刷新とこれから

Cybozu Inc.

@ueokande

---
# アジェンダ

- サイボウズはクラウド6年目
- サイボウズのログ基盤が、生まれ変わりました

---
# whois

- 上岡 真也
- 2016年サイボウズ入社
- アプリケーション基盤チーム
- GitHub/Twitter: @ueokande

---
# 目次

- 従来のログ基盤と限界
- ログ基盤のゼロからの刷新
- 新しいログ基盤のこれから

--- { "class": "title" }
# 従来のログ基盤と限界

---
# cybozu.comとは

- 2011年にスタートした、企業向けクラウドサービス
- 契約者数 17,000社以上
- ユーザ数65万人以上

<img style='float:right; width: 640px; margin-top: -180px' src="images/cybozucom.png">

---
# cybozu.comのインフラ事情

- 自社製データセンター
- ホスト数(実機 + VM): **1000+**
- ログ量
  <span style='font-weight: bold'><span style='font-size:2rem'>20億</span> 行/day</span>,
  <span style='font-weight: bold'><span style='font-size:2rem'>800</span> GB/day</span> くらい  
  （秒間 23,000行 くらい）

---
# これまでのログ基盤

1. ローテートされたログをtar化
  - ログファイルは1分間隔でlogrotateする
2. SSHでtarを転送
3. 転送できたログを削除する

---
# 何が問題か？

## スケールできない

- 転送量がログ量に追いつきつつあったが、容易にスケールできない

## 冗長構成できない

- ログ転送システムがSPOF
- ログが転送されないと、ディスク使用量が肥大化する

## アクセスログを可視化できていない

- ユーザの動向がビジネスに利用できていない

--- { "class": "damm" }
# ちくちょう。<br>刷新だ！

sleeping worker by reynermedia - flickr | <u>https://www.flickr.com/photos/89228431@N06/11285432175</u>

---
# 新ログ基盤の要件

## at least once

- ログを取りこぼすことなく集める

## スケーラビリティ

- ログの量が増えても安全な設計

## 信頼性

- 単一障害点を取り除いて、ログの転送が止まらないように

---
# 新ログ基盤アーキテクチャ

- 各ホストはKafkaクラスタに対してログを吐き出す
- Kafkaにはログの情報とメタデータをProtocol Buffersでエンコード

![アーキテクチャ](images/architecture.png)

---
# Apache Kafkaとは

- pub/sub型の分散メッセージングシステム
- LinkedInが開発してOSS化した
- いまはApacheトッププロジェクトで配布

<div style='float:right; width: 512px; height: 256px; background-position-y: center; background-size: cover;background-image: url(images/apache-kafka.png)'>


</div>

---
# Apache Kafkaを使う理由

## 分散メッセージングサービス

- Broker間でレプリケーションするので、Brokerが死んでも大丈夫
- クラスタにBrokerを追加することで容易にスケールできる

## pub/sub型

- ログを書く側と読む側が独自のタイミングで読み書きする
- pub/sub間のスループットやタイミングを考えなくてもよい

---
# 各ホストからKafka cluster

## 転送エージェント

<div style='float: right; margin-left: 32px; min-width: 480px; height: 400px; background-image: url(images/architecture.png); background-size: 150%; box-sizing: border-box;'></div>

- 自前で転送エージェントを実装
- inotifyでログファイルの更新を監視して逐一送る

---
# Kafka clusterから各サービス

## HBase

- ログをHadoop上に永続的に保存するために使用

<div style='float: right; margin-left:32px; min-width: 480px; height: 400px; background-position-x: 100%;background-image: url(images/architecture.png); background-size: 150%; box-sizing: border-box;'></div>

## Hive

- ユーザの動向をクエリで検索・解析するためにアクセスログを入れる

## Graylog (試験構築中)

- ログの検索、監視目的。ロールベースでいい感じに権限管理できる

---
# At least once

- システム全体で、ログを取りこぼすことなく配送
- マシンが**突然の死**を遂げても、不整合やデータロスが発生しない

---
# At least once <sub>| 各ホストからkafka cluster</sub>

- fluentdだと満たせないので、自前で転送エージェントを実装
- どこまでログを送ったかを記録


---
# At least once <sub>| kafka clusterから各サービス</sub>

## Kafka -> HBase

- データの処理が終わったoffsetをcommitする
- auto commitを無効化

## Kafka -> Hive

---
# At least once <sub>| 長いログへの対応</sub>

- Kafkaのレコード長には上限があるが、ログの長さは予想できない
- MySQLのスローログでは、1行が10MBを超えるケースもある
- Kafkaのレコードに、断片化されたログかのフラグを付与
- Kafkaから取り出すとき、若干大変...

---
# スケーラビリティ

- Kafka clusterは、Brokerノードを増やすことでスケールできる
- HBase、Hiveも、Hadoop上のサービスなので、スケールしやすい
- 新たにログが必要な要件が増えた時、Kafka Consumerも増やせる

---
# ログの解析など

Kafka -> Airpalの話

---
# 苦労話 <sub>| journaldの信頼性やばい</sub>

- アプリケーションのログをjournaldに集めるという計画もあった
  - journald: systemdのログデーモン
- 社内でjournaldを運用していたらいろいろ問題が
    - Disk Full時にjournaldが死亡する
    - 長いログの行が勝手に分割される
- 結局ファイル最強だった

---
# 苦労話 <sub>| 開発環境に救われた</sub>

- Kafka clusterを一時的に停止してみたら、HBaseまでの転送が大きく遅延した
- 原因はトピックの長さが違うから
- 開発環境に本番環境と同じ構成のKafka、Hadoopクラスタを構築していたから気づけた。
- 頑張ってkafkaのパラメータチューニングして解決

--- { "class": "title" }
# 新しいログ基盤のこれから

---
# これからのログ基盤

- ユーザデータとの連携
- 可視化・解析

---
# まとめ

- サイボウズのログ基盤が生まれ変わったよ
