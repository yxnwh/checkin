请勿fork，点亮star即可！

如有脚本同步需求，请自行搜索github-repo-sync教程

转载自https://github.com/Oreomeow/checkinpanel

修改后，自用

1.修改config.sh


ql repo命令拉取脚本时需要拉取的文件后缀，直接写文件后缀名即可

RepoFileExtensions="js pl py sh ts"

2.拉库


ql repo https://github.com/yxnwh/checkin/.git "api_|ck_|ins_" "^checkin" "^notify|^utils|cpm" "master"

3.运行 签到依赖 任务


4.拷贝文件


cp /ql/repo/yxnwh_checkin_main/check.sample.toml /ql/config/check.toml

cp /ql/repo/yxnwh_checkin_main/notify.sample.toml /ql/config/notify.toml（可选）

5.配置通知


选择自己常用的通知方式，填上参数
