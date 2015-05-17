angular.module('hori')
	.directive("horiHistoryBack", ["HistoryService",
		function(HistoryService) {
			return {
				restrict: "EA",
				link: function($scope, $element, $attrs) {
					$element.bind("click", function() {
						//if ($attrs.clickable) {
							HistoryService.goBack();
						//}
					});
				}
			};
		}
	])
	/*
	* 路由变更历史存储器
	*/
	.factory("HistoryStorage", function() {
		var storage = {};

		storage.set = function(key, value) {
			if (value !== undefined) {
				return sessionStorage.setItem(key, JSON.stringify(value));
			}
		};

		storage.get = function(key) {
			return JSON.parse(sessionStorage.getItem(key));
		};

		storage.remove = function(value) {
			sessionStorage.removeItem(value);
		};

		storage.clear = function() {
			sessionStorage.clear();
		};

		return storage;
	})
	/*
	* 路由变更历史服务
	*/
	.factory("HistoryService", ["$state", "HistoryStorage",
		function($state, HistoryStorage) {
			var service = {},
				historyKey = 'hori-history';

			service.History = {
				get: function() {
					return HistoryStorage.get(historyKey);
				},
				set: function(value) {
					return HistoryStorage.set(historyKey, value);
				},
				remove: function() {
					HistoryStorage.remove(historyKey);
				},
				hasMore: false
			};

			service.SessionHistory = {
				get: function() {
					return HistoryStorage.get("hori-session-history");
				},
				set: function(value) {
					return HistoryStorage.set("hori-session-history", value);
				}
			};

			service.isBack = false;

			service.clear = function() {
				service.History.remove();
				service.History.hasMore = false;
			};

			service.push = function(key, item) {
				var history = service.History.get(),
					sessionHistory = service.SessionHistory.get();

				if (history === null) {
					history = [];
				}

				if (sessionHistory === null) {
					sessionHistory = [];
				}

				//只有路由改变了才添加
				if (history.length === 0 || history[history.length - 1].name !== item.name) {
					history.push(item);
					sessionHistory.push(item);

					//在sessionHistory中只存储100条记录，用来跟踪路由变化
					if (sessionHistory.length > 100) {
						sessionHistory.shift();
					}

					service.History.set(history);
					service.SessionHistory.set(history);

					service.History.hasMore = history.length > 1;
				}
			};

			service.stateChange = function(toStateName, fromStateName, toStateParams) {
				if (service.isBack) {
					service.isBack = false;
					return;
				}

				service.push("", {
					name: toStateName,
					parameters: toStateParams
				});
			};

			service.goBack = function() {
				var history = service.History.get(),
					sessionHistory = service.SessionHistory.get(),
					backTo;

				if (history.length > 1) {
					backTo = history[history.length - 2];

					history.pop();
					service.History.set(history);

					service.History.hasMore = history.length > 1;
					service.isBack = true;

					//路由历史变化记录，包括后退操作
					sessionHistory.push(backTo);
					//最多只保存100条记录
					if (sessionHistory.length > 100) {
						sessionHistory.shift();
					}
					service.History.set(history);

					$state.go(backTo.name, backTo.parameters);
				} else {
					service.History.hasMore = false;
				}
			};

			return service;
		}
	])