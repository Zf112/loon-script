// 电信 VoLTE 状态检测脚本
const isSurge = typeof $httpClient !== "undefined";
const isQuanX = typeof $task !== "undefined";
const isLoon = typeof $loon !== "undefined";

function notify(msg) {
  if (isSurge) {
    $notification.post("📶 VoLTE 状态检测", "", msg);
  } else if (isQuanX) {
    $notify("📶 VoLTE 状态检测", "", msg);
  } else if (isLoon) {
    $notification.post("📶 VoLTE 状态检测", "", msg);
  }
}

const req = {
  url: "https://open.e.189.cn/api/logbox/config/encryptConf.do",
  method: "GET",
  headers: {
    "User-Agent": "ChinaTelecom/1.0 CFNetwork/1390.0.1 Darwin/22.0.0",
  },
};

function handleResponse(data) {
  let msg;
  if (data && data.includes("VoLTE开通")) {
    msg = "✅ 已开通 VoLTE 服务";
  } else {
    msg = "⚠️ 未开通 VoLTE，请拨打 10000 开通";
  }
  notify(msg);
  done();
}

function done() {
  if (isSurge || isLoon) {
    $done();
  } else if (isQuanX) {
    $done({});
  }
}

if (isSurge || isLoon) {
  $httpClient.get(req, (err, resp, data) => {
    if (err) {
      notify("❌ 检测失败，请检查网络");
      done();
    } else {
      handleResponse(data);
    }
  });
} else if (isQuanX) {
  $task.fetch(req).then(
    resp => {
      handleResponse(resp.body);
    },
    () => {
      notify("❌ 检测失败，请检查网络");
      done();
    }
  );
}
