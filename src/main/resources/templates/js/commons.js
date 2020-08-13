/**
 * @author 신춘호(sch0718@naver.com)
 * @date 2016. 5. 2.
 * @file commons.js
 */

/**
 * 문자열의 바이트 수를 리턴한다.
 * @returns byte 수
 * @author 신춘호(sch0718@naver.com)
 */
if (!String.prototype.byteLength) {
	String.prototype.byteLength = function() {
		return (function(str, bytes, index, char) {
			for (bytes = index = 0; char = str.charCodeAt(index++); bytes += char >> 11 ? 3 : char >> 7 ? 2 : 1);
			return bytes
		})(this);
	};
}

/**
 * 문자열이 length보다 작은 자리수일 경우 앞에 0을 붙인다. ex) "123".zeroMask(5);
 * @param length 0을 붙일 길이
 * @returns 0을 붙인 문자열
 * @author 신춘호(sch0718@naver.com)
 */
if (!String.prototype.zeroMask) {
	String.prototype.zeroMask = function(length) {
		return (function(str, length) {
			for (; str.length < length; str = "0" + str);
			return str;
		})(this, length);
	};
}

/**
 * <pre>
 * startsWith 함수가 지원되지 않는 경우 상속하여 재구현 검색 할 문자열로 시작되는지 여부를 리턴한다.
 * ex)
 * "abcdefg".startsWith("abc"); -> true
 * "abcdefg".startsWith("abc", 3); -> false
 * </pre>
 * 
 * @param searchString 검색 할 문자열
 * @param position (optional) 검색 시작 위치
 * @return 검색 할 문자열로 시작 여부
 * @author 신춘호(sch0718@naver.com)
 */
if (!String.prototype.startsWith) {
	String.prototype.startsWith = function(searchString, position) {
		position = position || 0;
		return this.indexOf(searchString, position) === position;
	};
}


if (!String.prototype.parseDate) {
	String.prototype.parseDate = function(format) {
		const formatChars = [ "yyyy", "yy", "MM", "dd", "E", "HH", "hh", "mm", "ss", "a", "p" ];
		const formatMap = new Map();
		formatChars.forEach(function(value, array) {
			if (format.includes(value)) {
				formatMap.set(value, {
					start: format.indexOf(value),
					end: format.indexOf(value) + value.length
				});
			}
		});
		
		let yearText = null;
		let pos = null;
		if (formatMap.has("yyyy")) {
			pos = formatMap.get("yyyy");
			yearText = this.substring(pos.start, pos.end);
		} else {
			if (formatMap.has("yy")) {
				yearText = "19" + this.substring(pos.start, pos.end);
			}
		}
		
		let monthText = null;
		if (formatMap.has("MM")) {
			pos = formatMap.get("MM");
			monthText = this.substring(pos.start, pos.end);
		}
		
		
		let dateText = null;
		if (formatMap.has("dd")) {
			pos = formatMap.get("dd");
			dateText = this.substring(pos.start, pos.end);
		}
		
		let hourText = null;
		if (formatMap.has("HH")) {
			pos = formatMap.get("HH");
			hourText = this.substring(pos.start, pos.end);
		} else if (formatMap.has("hh") && (formatMap.has("a") || formatMap.has("p"))) {
			pos = formatMap.get("hh");
			hourText = this.substring(pos.start, pos.end);
			
			if (formatMap.has("p")) {
				hourText = Number(hourText) + 12;
			}
		}
		
		let minuteText = null;
		if (formatMap.has("mm")) {
			pos = formatMap.get("mm");
			minuteText = this.substring(pos.start, pos.end);
		}
		
		let secondText = null;
		if (formatMap.has("ss")) {
			pos = formatMap.get("ss");
			secondText = this.substring(pos.start, pos.end);
		}
		
		return new Date(yearText + "-" + monthText + "-" + dateText + "T" + hourText + ":" + minuteText + ":" + secondText);
	}
}

if (!Date.prototype.format) {
	Date.prototype.format = function(f) {
		if (!this.valueOf())
			return "";
		var weekName = [ "일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일" ];
		var d = this;
		return f.replace(/(yyyy|yy|MM|dd|E|HH|hh|mm|ss|a\/p)/gi, function($1) {
			switch ($1) {
				case "yyyy":
					return d.getFullYear();
				case "yy":
					return ((d.getFullYear() % 1000) + "").zeroMask(2);
				case "MM":
					return ((d.getMonth() + 1) + "").zeroMask(2);
				case "dd":
					return (d.getDate() + "").zeroMask(2);
				case "E":
					return weekName[d.getDay()];
				case "HH":
					return (d.getHours() + "").zeroMask(2);
				case "hh":
					return (((h = d.getHours() % 12) ? h : 12) + "").zeroMask(2);
				case "mm":
					return (d.getMinutes() + "").zeroMask(2);
				case "ss":
					return (d.getSeconds() + "").zeroMask(2);
				case "a/p":
					return d.getHours() < 12 ? "오전" : "오후";
				default:
					return $1;
			}
		});
	};
}

/**
 * <pre>
 * 배열 Utilities
 * 
 * ex)
 * var array = [ "a", "b", "c", "d" ];
 * console.log("array: " + array.toString()); -> array: a,b,c,d
 * console.log("c index: " + ArrayUtils.getIndex(array, "c")); -> c index: 2
 * console.log("e index: " + ArrayUtils.getIndex(array, "e")); -> e index: -1
 * console.log("add e: " + ArrayUtils.insert(array, "e").toString()); -> add e: a,b,c,d,e
 * console.log("add f to 3: " + ArrayUtils.insert(array, 3, "f").toString()); -> add f to 3: a,b,c,f,d,e
 * console.log("remove b: " + ArrayUtils.remove(array, "b").toString()); -> remove b: b
 * console.log("array: " + array.toString()); -> array: a,c,f,d,e
 * </pre>
 * @author 신춘호(sch0718@naver.com)
 */
ArrayUtils = {
	/**
	 * 배열의 지정된 값의 위치를 리턴한다.
	 * @param array 배열
	 * @param value 값
	 * @return 값의 위치
	 */
	getIndex: function(array, value) {
		return array.findIndex(function(currentValue) {
			return value == currentValue;
		});
	},
	/**
	 * 배열에 새로운 값을 추가한다.
	 * @param array 배열
	 * @param index(option) 추가 할 index
	 * @param value 값
	 * return 추가된 새로운 배열
	 */
	insert: function(array, index, value) {
		let howmany = 0;
		if (value == null || value == undefined)  {
			value = index;
			index = array.length;
			howmany = 1;
		}
		array.splice(index, howmany, value);
		return array;
	},
	/**
	 * 배열의 지정된 값을 삭제한다.
	 * @param array 배열
	 * @param value 삭제할 값
	 * @return 삭제된 새로운 배열
	 */
	remove: function(array, value) {
		const me = this;
		return array.splice(me.getIndex(array, value), 1);
	},
	replace: function(array, index, value) {
		return array.splice(index, 1, value);
	}
};

/**
 * <pre>
 * Java의 Set 클래스를 일부 구현
 * ex)
 * var set = new Set();
 * console.log("isEmpty: " + set.isEmpty()); -> isEmpty: true
 * set.add("a");
 * set.add("b");
 * set.add("c");
 * set.add("a");
 * console.log("isEmpty: " + set.isEmpty()); -> isEmpty: false
 * console.log("size: " + set.size()); -> size: 3
 * console.log("contains a: " + set.contains("a")); -> contains a: true
 * console.log("contains d: " + set.contains("d")); -> contains d: false
 * console.log("toString: " + set.toString()); -> toString: a,b,c
 * console.log("remove a: " + set.remove("a")); -> remove a: true
 * console.log("toString: " + set.toString()); -> toString: b,c
 * var set2 = set.clone();
 * set.clear();
 * console.log("set size: " + set.size()); -> set size: 0
 * console.log("set2 size: " + set2.size()); -> set2 size: 2
 * </pre>
 * @dependency ArrayUtils
 * @author 신춘호(sch0718@naver.com)
 */
/*var Set = function() {
	var values = new Array();

	*//**
	 * 값을 추가한다.
	 * @param value 값
	 * @return 성공여부
	 *//*
	this.add = function(value) {
		try {
			if (!this.contains(value)) values.push(value);
			return true;
		} catch (e) {
			return false
		}
	};
	
	*//**
	 * 세트의 모든 데이터를 삭제한다.
	 *//*
	this.clear = function() {
		values = new Array();
	};
	
	*//**
	 * 세트를 복제한다.
	 * @return 복제된 세트
	 *//*
	this.clone = function() {
		var set = new Set();
		for (var i in values) {
			set.add(values[i]);
		}
		return set;
	};
	
	*//**
	 * 지정된 값이 세트에 이미 존재하는지 여부를 리턴한다.
	 * @param value 값
	 * @return 값이 세트에 이미 존재하는지 여부
	 *//*
	this.contains = function(value) {
		return ArrayUtils.getIndex(values, value) > -1;
	};
	
	*//**
	 * 세트가 비어있는지 여부를 리턴한다.
	 * @return 세트가 비어있는지 여부
	 *//*
	this.isEmpty = function() {
		return values.length == 0;
	};
	
	*//**
	 * 지정된 값을 세트에서 삭제한다.
	 * @param value 삭제하려는 값
	 * @return 성공 여부
	 *//*
	this.remove = function(value) {
		try {
			ArrayUtils.remove(values, value);
			return true;
		} catch (e) {
			return false;
		}
	};
	
	*//**
	 * 세트의 크기를 리턴한다.
	 * @return 세트의 크기
	 *//*
	this.size = function() {
		return values.length;
	};
	
	*//**
	 * 세트를 배열로 변환하여 리턴한다.
	 * @return 배열
	 *//*
	this.toArray = function() {
		return values;
	};
	
	*//**
	 * 세트의 값들을 구분자(',')로 나열하여 문자열로 리턴한다.
	 * @return 세트 값들의 문자열
	 *//*
	this.toString = function() {
		return values.toString();
	};
};*/

/**
 * <pre>
 * Java의 Map 클래스를 일부 구현
 * ex)
 * var map = new Map();
 * console.log("isEmpty: " + map.isEmpty()); -> isEmpty: true
 * map.put("a", "a");
 * map.put("b", "b");
 * map.put("c", "c");
 * map.put("a", "aa");
 * console.log("toString: " + map.toString()); -> toString: b=b,c=c,a=aa
 * console.log("isEmpty: " + map.isEmpty()); -> isEmpty: false
 * console.log("size: " + map.size()); -> size: 3
 * console.log("contains key a: " + map.containsKey("a")); -> contains key a: true
 * console.log("contains key d: " + map.containsKey("d")); -> contains key d: false
 * console.log("contains value a: " + map.containsValue("a")); -> contains value a: false
 * console.log("contains value b: " + map.containsValue("b")); -> contains value b: true
 * console.log("get a: " + map.get("a")); -> get a: aa
 * console.log("remove a: " + map.remove("a")); -> remove a: aa
 * console.log("keyset toString: " + map.keySet().toString()); -> keyset toString: b,c
 * console.log("values toString: " + map.values().toString()); -> values toString: b,c
 * console.log("toString: " + map.toString()); -> toString: b=b,c=c
 * var map2 = map.clone();
 * map.clear();
 * console.log("map size: " + map.size()); -> map size: 0
 * console.log("map2 size: " + map2.size()); -> map2 size: 2
 * </pre>
 * @author 신춘호(sch0718@naver.com)
 * @dependency ArrayUtils, Set
 */
/*var Map = function() {
	var keySet = new Set();
	var valueSet = new Set();

	*//**
	 * 맵의 모든 데이터를 삭제한다.
	 *//*
	this.clear = function() {
		keySet.clear();
		valueSet.clear();
	};
	
	*//**
	 * 맵을 복제한다.
	 * @return 복제된 맵
	 *//*
	this.clone = function() {
		var clone = new Map();
		clone.putAll(this);
		return clone;
	};
	
	*//**
	 * 지정된 키가 맵에 이미 존재하는지 여부를 리턴한다.
	 * @param key 키
	 * @return 키가 맵에 이미 존재하는지 여부
	 *//*
	this.containsKey = function(key) {
		return keySet.contains(key);
	};
	
	*//**
	 * 지정된 값이 맵에 이미 존재하는지 여부를 리턴한다.
	 * @param value 값
	 * @return 값이 맵에 이미 존재하는지 여부
	 *//*
	this.containsValue = function(value) {
		return valueSet.contains(value);
	};
	
	*//**
	 * 지정된 키의 값을 리턴한다. 키로 매핑된 값이 없으면 null을 리턴한다.
	 * @param key 키
	 * @return 지정된 키로 매핑된 값
	 *//*
	this.get = function(key) {
		if (this.containsKey(key)) {
			var keyArray = keySet.toArray();
			var valueArray = valueSet.toArray();
			return valueArray[ArrayUtils.getIndex(keyArray, key)];
		}
		return null;
	};
	
	*//**
	 * 맵이 비어있는지 여부를 리턴한다.
	 * @return 맵이 비어있는지 여부
	 *//*
	this.isEmpty = function() {
		return this.size() == 0;
	};
	
	*//**
	 * 맵의 키 세트를 리턴한다.
	 * @return 키 세트
	 *//*
	this.keySet = function() {
		return keySet;
	};
	
	*//**
	 * 지정된 키로 값을 매핑한다. 이미 키가 존재할 경우 해당 키의 값을 수정한다.
	 * @param key 키
	 * @param value 값
	 * @return 지정된 값
	 *//*
	this.put = function(key, value) {
		if (this.containsKey(key)) {
			valueSet.remove(this.get(key));
			keySet.remove(key);
		}
		keySet.add(key);
		valueSet.add(value);
		return value;
	};
	
	*//**
	 * 해당 맵의 키와 값을 모두 매핑한다.
	 * @param map 키와 값을 넣을 Map 객체
	 *//*
	this.putAll = function(map) {
		var keyArray = map.keySet().toArray();
		var valueArray = map.values().toArray();
		for (var i in keyArray) {
			this.put(keyArray[i], valueArray[i]);
		}
	};
	
	*//**
	 * 지정된 키의 데이터를 삭제한다.
	 * @param key 키
	 * @return 제거된 키의 값(지정된 키가 없었을 경우 null)
	 *//*
	this.remove = function(key) {
		if (this.containsKey(key)) {
			var value = this.get(key);
			valueSet.remove(value);
			keySet.remove(key);
			return value;
		}
		return null;
	};
	
	*//**
	 * 맵의 크기를 리턴한다.
	 * @return 맵의 크기
	 *//*
	this.size = function() {
		return keySet.size();
	};
	
	*//**
	 * 맵의 값 세트를 리턴한다.
	 * @return 값 세트
	 *//*
	this.values = function() {
		return valueSet;
	};
	
	*//**
	 * 맵의 키와 값들을 구분자(',')로 나열하여 문자열로 리턴한다.
	 * @return 세트 키와 값들의 문자열
	 *//*
	this.toString = function toString() {
		var text = "";
		var keyArray = keySet.toArray();
		var valueArray = valueSet.toArray();
		for (var i in keyArray) {
			text += keyArray[i].toString() + "=" + valueArray[i].toString();
			if (i != keyArray.length - 1) text += ",";
		}
		return text;
	};	
};*/

/**
 * Pagination 기능 구현
 * @author 신춘호(sch0718@naver.com)
 * @dependency jQuery, jQuery-cookie
 */
const Pagination = {
	formId: "search-form",
	pageParamName: "page",
	sizeParamName: "size",
	cookieName: "Pageable.size",
	getForm: function() {
		var me = this;
		return $("#" + me.formId);
	},
	goPage: function(pageNum) {
		try {
			var me = this;
			var form = me.getForm();
			$("[name='" + me.pageParamName + "']", form).val(pageNum);
			form.submit();
		} catch (e) {
			log.debug(e);
		}
	},
	changeSize: function(pageSize) {
		var me = this;
		var form = me.getForm();
		$("[name='" + me.pageParamName + "']", form).val(0);
		$("[name='" + me.sizeParamName + "']", form).val(pageSize);
		me.setCookie();
		form.submit();
	},
	setCookie: function() {
		var me = this;
		var form = me.getForm();
		$.cookie(me.cookieName, $("[name='" + me.sizeParamName + "']", form).val(), {
			expires: 30,
			path: "/"
		});
	}
};

/**
 * Waiting Back Drop
 * @author 신춘호(sch0718@naver.com)
 * @dependency jQuery
 */
const Waiting = {
	defaults: {
		iconClass: "fa-fw",
		sizeClass: "fa-5x",
		isInit: false
	},
	create: function() {
		var me = this;
		if (me.defaults.isInit)
			return;

		var html = "<div id=\"waiting-body\" class=\"modal-backdrop fade in wait\">";
		html += "<div class=\"outer\">";
		html += "<div class=\"inner\">";
		html += "<span class=\"fa fa-spinner fa-spin " + me.defaults.iconClass + " " + me.defaults.sizeClass + "\"></span>";
		html += "</div>";
		html += "</div>";
		html += "</div>";
		$(html).appendTo(document.body);
		me.hide();
		me.defaults.isInit = true;
		return me;
	},
	show: function(second) {
		var me = this;
		if (!me.defaults.isInit)
			me.create();

		$("#waiting-body").show();
		return me;
	},
	hide: function() {
		var me = this;
		if (!me.defaults.isInit)
			return;

		$("#waiting-body").hide();
	}
};

/**
 * Ajax Wrapper
 * @author 신춘호(sch0718@naver.com)
 * @dependency jQuery
 */
const Ajax = {
	defaults: {
		url: null,
		method: "GET",
		contentType: "application/json; charset=utf-8",
		dataType: "json",
		crossDomain: true,
		xhrFields: {
			withCredentials: true
		},
		data: null,
		traditional: true,
		success: function(data, textStatus, jqXHR) {},
		error: function(jqXHR, textStatus, errorThrown) {
			let errorMessage = "오류가 발생하였습니다.";
			if (!isNull(jqXHR.responseJSON)) {
				if (!isNull(jqXHR.responseJSON.response)) errorMessage += " - " + jqXHR.responseJSON.response.message;
				else errorMessage += " - " + jqXHR.responseJSON.message;
			} else if (!isNull(jqXHR.responseText)) {
				try {
					const json = JSON.parse(jqXHR.responseText);
					errorMessage += " - " + json.message;
				} catch (e) {}
			}
			alert(errorMessage);
			console.log(JSON.stringify(jqXHR));
		},
		beforeSend: function(jqXHR, settings) {}
	},
	ajax: function(options) {
		var me = this;
		if (typeof (options) == "string")
			options = JSON.parse(options);
		options = $.extend(true, {}, me.defaults, options);
		$.ajax(options);
	}
};

/**
 * jQuery Plugins
 */
jQuery.fn.extend({
	/**
	 * Designed Checkbox jQuery Plugin
	 * <pre>
	 * ex)
	 * - Basic
	 * <input type="checkbox" id="basic" />
	 * 
	 * $("#basic").checkbox();
	 * 
	 * - Extension
	 * <input type="checkbox" id="extend" />
	 * 
	 * $("#extend").checkbox({
	 * 		button: {
	 * 			icon: [ "fa fa-eye", "" ]
	 * 		}
	 * }).bind("checkbox.checked", function(event) {
	 * 		var iconWrapElement = $(this).siblings(".fa-stack-2x");
	 * 		iconWrapElement.addClass("fa fa-ban text-danger");
	 * }).bind("checkbox.released", function(event) {
	 * 		var iconWrapElement = $(this).siblings(".fa-stack-2x");
	 * 		iconWrapElement.removeClass("fa fa-ban text-danger");
	 * }).filter(":checked").siblings(".fa-stack-2x").addClass("fa fa-ban text-danger");
	 * </pre>
	 * @param options json type string or json object
	 * @author 신춘호(sch0718@naver.com)
	 * @dependency jQuery, bootstrap, font-awesome
	 */
	checkbox: function(command, options) {
		if (![ "update", "enable", "disable" ].includes(command) && isNull(options)) {
			options = command;
			command = "create";
		}
		var defaults = {
			button: {
				icon: "fa fa-check"
			}
		};
		if ("create" == command) {
			return this.each(function(index, element) {
				var me = $(this);

				if (me.data("init") == "true")
					return true;
				if (typeof (options) == "string")
					options = JSON.parse(options);
				options = $.extend(true, {}, defaults, options);

				generateComponent(me, options);
			});
		} else if ("update" == command) {
			return this.each(function(index, element) {
				var me = $(this);

				if (typeof (options) == "string")
					options = JSON.parse(options);
				options = $.extend(true, {}, defaults, options);

				renderComponent(me, options);
			});
		} else if ("disable" == command) {
			return this.each(function(index, element) {
				var me = $(this);

				me.parent().addClass("disabled");
			});
		} else if ("enable" == command) {
			return this.each(function(index, element) {
				var me = $(this);

				me.parent().removeClass("disabled");
			});
		}

		function generateComponent(element, options) {
			element.attr("autocomplete", "off");
			element.data("init", "true");
			var parent = element.parent();
			parent.attr("data-toggle", "buttons");
			element.wrap("<label class=\"btn btn-default checkbox fa-stack\"></label>");
			var label = element.parent();
			if (typeof (options.button.icon) == "object") {
				$.each(options.button.icon, function(index, value) {
					label.append("<span class=\"" + value + " fa-stack-" + (index + 1) + "x\" />");
				});
			} else {
				label.append("<span class=\"" + options.button.icon + " fa-stack-1x\" />");
			}
			
			renderComponent(element, options);
			
			element.bind("change", function(event) {
				if (element.prop("readonly") || element.prop("disabled")) return;
				
				renderComponent($(this), options);
				if ($(this).prop("checked")) {
					$(this).trigger("checkbox.checked");
				} else {
					$(this).trigger("checkbox.released");
				}
			});
		}
		
		function renderComponent(element, options) {
			var label = element.parent();
			label.toggleClass("active", element.prop("checked"));
			$(".fa-stack-1x", label).toggleClass(options.button.icon, element.prop("checked"));
			
			if (element.prop("readonly") || element.prop("disabled")) {
				element.parent().addClass("disabled");
			}
		}
	},
	/**
	 * jQuery Plugin bootstrap modal to easy create DOM
	 * <pre>
	 * ex)
	 * - Basic
	 * <button class="btn btn-primary" title="열기" data-toggle="modal" data-target="#basic">
	 * 		<span class="fa fa-window-restore" aria-hidden="true"></span>
	 * </button>
	 * <div id="basic">
	 * 		<div class="modal-content">
	 * 			<div class="modal-header">
	 * 				<button type="button" class="close" data-dismiss="modal" aria-label="Close">
	 * 					<span aria-hidden="true">×</span>
	 * 				</button>
	 * 				<h4 class="modal-title" id="modalLabel">Title</h4>
	 * 			</div>
	 * 			<div class="modal-body">Content</div>
	 * 			<div class="modal-footer">
	 * 				<button type="button" class="btn btn-default" data-dismiss="modal">
	 * 					<span class="glyphicon glyphicon-remove-sign" aria-hidden="true"></span> 닫기
	 * 				</button>
	 * 			</div>
	 * 		</div>
	 * </div>
	 * 
	 * $("#basic").modalLayer();
	 * 
	 * - Basic iframe
	 * <button class="btn btn-primary" title="열기" data-toggle="modal" data-target="#basic-iframe">
	 * 		<span class="fa fa-window-restore" aria-hidden="true"></span>
	 * </button>
	 * <div id="basic-iframe"></div>
	 * 
	 * var basicIframeObj = $("#basic-iframe-object");
	 * html = $("").html(basicIframeObj.html()).html();
	 * $("#basic-iframe").modalLayer({
	 * 		type: "iframe",
	 * 		href: "http://www.code-post.com/",
	 * 		title: "code post"
	 * });
	 * 
	 * - Extension
	 * <button class="btn btn-primary" title="열기" data-toggle="modal" data-target="#extend">
	 * 		<span class="fa fa-window-restore" aria-hidden="true"></span>
	 * </button>
	 * <div id="extend"></div>
	 * 
	 * var extendObject = $("#extend-object");
	 * html = $("").html(extendObject.html()).html();
	 * $("#extend").modalLayer({
	 * 		type: "iframe",
	 * 		href: "http://www.code-post.com/",
	 * 		size: "xl",
	 * 		title: "code post",
	 * 		buttons: {
	 * 			text: "좋아요",
	 * 			class: "btn btn-success",
	 * 			icon: "fa fa-heart",
	 * 			callback: recommand
	 * 		}
	 * });
	 * </pre>
	 * @param options json type string or json object
	 * @author 신춘호(sch0718@naver.com)
	 * @dependency jQuery, bootstrap
	 */
	modalLayer: function(command, options) {
		if (![ "destroy", "show", "hide" ].includes(command) && isNull(options)) {
			options = command;
			command = "create";
		}
		var defaults = {
			type: "normal",
			animate: true,
			size: "lg",
			tabIndex: -1,
			title: null,
			href: null,
			buttons: null,
			callback: null
		};
		if ("create" == command) {
			return this.each(function(index, element) {
				var me = $(element);

				if (typeof (options) == "string")
					options = JSON.parse(options);
				options = $.extend(true, {}, defaults, options);

				generateModal(me, options);
				eventBinding(me, options);
			});
		} else if ("show" == command) {
			return this.each(function(index, element) {
				var me = $(element);
				me.modal("show");
			});
		} else if ("hide" == command) {
			return this.each(function(index, element) {
				var me = $(element);
				me.modal("hide");
			});
		}

		function generateModal(target, options) {
			target.addClass("modal" + (options.animate ? " fade" : ""));
			target.attr("tabindex", options.tabIndex);
			target.attr("role", "dialog");
			target.attr("aria-labelledby", target.prop("id") + "-modalLabel");

			var html = "<div class=\"modal-dialog modal-" + options.size + "\" role=\"document\">";
			html += "<div class=\"modal-content\">";
			if ("iframe" == options.type) {
				html += "<div class=\"modal-header\">";
				html += "<button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\">";
				html += "<span aria-hidden=\"true\">&times;</span>";
				html += "</button>";
				html += "<h4 class=\"modal-title\" id=\"" + target.prop("id") + "-modalLabel\">" + (!isNull(options.title) ? options.title : "") + "</h4>";
				html += "</div>";
				html += "<div class=\"modal-body\">";
				html += "<div class=\"embed-responsive embed-responsive-16by9\">";
				html += "<iframe name=\"modal-frame\" class=\"embed-responsive-item\"></iframe>";
				html += "</div>";
				html += "</div>";
				html += "<div class=\"modal-footer\">";
				html += "<div class=\"btn-group pull-right\" role=\"group\">";
				if (!isNull(options.buttons)) {
					if (typeof (options.buttons) == "array") {
						for (var i in options.buttons) {
							var btn = options.buttons[i];
							html += "<button type=\"button\" id=\"modal-btn-" + i + "\" class=\"modal-button " + getStringDefault(btn.class) + "\">";
							if (!isNull(btn.icon)) {
								html += "<span class=\"" + btn.icon + "\"></span> ";
							}
							html += getStringDefault(btn.text);
							html += "</button>";
						}
					} else {
						var btn = options.buttons;
						html += "<button type=\"button\" id=\"modal-btn-0\" class=\"modal-button " + getStringDefault(btn.class) + "\">";
						if (!isNull(btn.icon)) {
							html += "<span class=\"" + btn.icon + "\"></span> ";
						}
						html += getStringDefault(btn.text);
						html += "</button>";
					}
				}
				html += "<button type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\">";
				html += "<span class=\"fa fa-times\"></span> 닫기";
				html += "</button>";
				html += "</div>";
				html += "</div>";
			} else {
				html += target.html();
			}
			html += "</div>";
			html += "</div>";
			target.empty();
			target.append(html);
		}

		function eventBinding(target, options) {
			target.bind("show.bs.modal", function(event) {
				if ((options.type == "normal" && !isNull(options.href)) || options.type == "iframe") {
					Waiting.show($(".modal-content", $(this)));
				}
			});

			target.bind("shown.bs.modal", function(event) {
				if (options.type == "normal" && !isNull(options.href)) {
					$(".modal-content", $(this)).empty();
					$(".modal-content", $(this)).load(options.href);
				} else if (options.type == "iframe") {
					var iframe = $("iframe", target);
					iframe.prop("src", options.href);
					if (!isNull(options.buttons)) {
						var buttonElements = getButtons($(this));
						buttonElements.unbind("click");
						if (typeof (options.buttons) == "array") {
							for (var i in options.buttons) {
								var btn = options.buttons[i];
								if (!isNull(btn.callback) && typeof (btn.callback) == "function") {
									buttonElements.get(i).bind("click", btn.callback);
								}
							}
						} else {
							var btn = options.buttons;
							if (!isNull(btn.callback) && typeof (btn.callback) == "function") {
								buttonElements.bind("click", btn.callback);
							}
						}
					}
				}
				if (!isNull(options.callback) && typeof (options.callback) == "function") {
					options.callback($(this));
				}
				Waiting.hide($(".modal-content", $(this)));
			});
		}

		function getButtons(target) {
			return $(".modal-button", target);
		}
	},
	/**
	 * Form Objects serialize to Json
	 * <pre>
	 * ex)
	 * <form id="form">
	 * 		<input type="text" name="text1" value="value1" />
	 * 		<input type="text" name="text2" value="value2" />
	 * </form>
	 * 
	 * var json = $("#form").serializeJson();
	 * json => { text1: "value1", text2: "value2" }
	 * </pre>
	 * @author 신춘호(sch0718@naver.com)
	 * @dependency jQuery
	 */
	serializeJson: function() {
		var arrayData = this.serializeArray();
		var objectData = {};

		$.each(arrayData, function() {
			var value;

			if (this.value != null) {
				value = this.value;
			} else {
				value = "";
			}

			if (objectData[this.name] != null) {
				if (!objectData[this.name].push) {
					objectData[this.name] = [ objectData[this.name] ];
				}

				objectData[this.name].push(value);
			} else {
				objectData[this.name] = value;
			}
		});

		return objectData;
	},
	/**
	 * Designed Tree Component jQuery Plugin
	 * <pre>
	 * ex)
	 * - Basic
	 * Data: {"root":{"visible":"true","depth":"0","enable":"true","index":"0","comment":"","id":"root","text":"Root Node","leaf":"false","children":[{"visible":"true","depth":"1","enable":"true","index":"0","comment":"공지사항 구분코드","id":"57beaa66249fe441fbfb3dff","text":"공지사항 구분코드","leaf":"false","value":"noticeBBSCode","parentId":"root","children":[{"visible":"true","depth":"2","enable":"true","index":"0","comment":"긴급","id":"581984db3c287c361b003ef0","text":"긴급","leaf":"true","value":"emergency","parentId":"57beaa66249fe441fbfb3dff"},{"visible":"true","depth":"2","enable":"true","index":"1","comment":"중요","id":"581985c13c287c361b003ef1","text":"중요","leaf":"true","value":"important","parentId":"57beaa66249fe441fbfb3dff"}]},{"visible":"true","depth":"1","enable":"true","index":"1","comment":"자유게시판 구분코드","id":"57beaa6a249fe441fbfb3e00","text":"자유게시판 구분코드","leaf":"false","value":"freeBBSCode","parentId":"root","children":[{"visible":"true","depth":"2","enable":"true","index":"0","comment":"","id":"581c323e0eceab944a26421f","text":"코드1","leaf":"true","value":"code1","parentId":"57beaa6a249fe441fbfb3e00"},{"visible":"true","depth":"2","enable":"true","index":"1","comment":"","id":"581c324f0eceab944a264220","text":"코드2","leaf":"true","value":"code2","parentId":"57beaa6a249fe441fbfb3e00"},{"visible":"true","depth":"2","enable":"true","index":"2","comment":"","id":"581c325b0eceab944a264221","text":"코드3","leaf":"true","value":"code3","parentId":"57beaa6a249fe441fbfb3e00"}]},{"visible":"true","depth":"1","enable":"true","index":"2","comment":"갤러리 구분코드","id":"581984a13c287c361b003eef","text":"갤러리 구분코드","leaf":"true","value":"gallaryBBSCode","parentId":"root"}]}}
	 * 
	 * <div id="basic" class="view-area tree"></div>
	 * 
	 * $("#basic").tree({
	 * 		data: basicData.root
	 * });
	 * 
	 * - Extension
	 * Data: [{"id":"01","text":"로컬 디스크 (C:)","index":"0","comment":"C 드라이브","enable":"true","visible":"true","depth":"0","leaf":"false","icon":{"node":"fa fa-hdd-o fa-fw"},"children":[{"id":"0101","text":"Program Files","index":"0","comment":"Program Files(64bit)","enable":"true","visible":"true","depth":"1","leaf":"false","icon":{"node":"fa fa-folder-o fa-fw"},"children":[{"id":"010101","text":"EditPlus3","index":"0","comment":"","enable":"true","visible":"true","depth":"2","leaf":"false","icon":{"node":"fa fa-folder-o fa-fw"},"children":[{"id":"01010101","text":"editplus.exe","index":"0","comment":"","enable":"true","visible":"true","depth":"3","leaf":"true","icon":{"node":"fa fa-file-o fa-fw"}},{"id":"01010102","text":"readme.txt","index":"1","comment":"","enable":"true","visible":"true","depth":"3","leaf":"true","icon":{"node":"fa fa-file-text-o fa-fw"}},{"id":"01010103","text":"menual.pdf","index":"2","comment":"","enable":"true","visible":"true","depth":"3","leaf":"true","icon":{"node":"fa fa-file-pdf-o fa-fw"}}]}]},{"id":"0102","text":"Program Files(x86)","index":"1","comment":"Program Files(32bit)","enable":"true","visible":"true","depth":"1","leaf":"true","icon":{"node":"fa fa-folder-o fa-fw"}}]},{"id":"02","text":"로컬 디스크 (D:)","index":"1","comment":"D 드라이브","enable":"true","visible":"true","depth":"0","leaf":"false","icon":{"node":"fa fa-hdd-o fa-fw"},"children":[{"id":"0201","text":"00.Downloads","index":"0","comment":"","enable":"true","visible":"true","depth":"1","leaf":"false","icon":{"node":"fa fa-folder-o fa-fw"},"children":[{"id":"020101","text":"sample.mp4","index":"0","comment":"","enable":"true","visible":"true","depth":"2","leaf":"true","icon":{"node":"fa fa-file-video-o fa-fw"}},{"id":"020102","text":"아이유 - 이름에게.mp3","index":"1","comment":"","enable":"true","visible":"true","depth":"2","leaf":"true","icon":{"node":"fa fa-file-audio-o fa-fw"}},{"id":"020103","text":"장부.xlsx","index":"3","comment":"","enable":"true","visible":"true","depth":"2","leaf":"true","icon":{"node":"fa fa-file-excel-o fa-fw"}}]},{"id":"0202","text":"01.Programss","index":"1","comment":"","enable":"true","visible":"true","depth":"1","leaf":"false","icon":{"node":"fa fa-folder-o fa-fw"},"children":[{"id":"020201","text":"eclipse.zip","index":"0","comment":"","enable":"true","visible":"true","depth":"2","leaf":"true","icon":{"node":"fa fa-file-archive-o fa-fw"}},{"id":"020202","text":"apache-tomcat-8.5.11-windows-x64.zip","index":"1","comment":"","enable":"true","visible":"true","depth":"2","leaf":"true","icon":{"node":"fa fa-file-archive-o fa-fw"}}]}]}]
	 * 
	 * <div id="extend" class="view-area tree"></div>
	 * 
	 * $("#extend").tree({
	 * 		icon: {
	 * 			open: "fa fa-angle-down fa-fw",
	 * 			close: "fa fa-angle-right fa-fw",
	 * 			none: "fa fa-fw"
	 * 		},
	 * 		data: extendData
	 * });
	 * </pre>
	 * @author 신춘호(sch0718@naver.com)
	 * @dependency jQuery, bootstrap, font-awesome
	 */
	tree: function(command, options) {
		if ("destroy" == command) {
			return this.each(function(index, element) {
				var me = $(this);
				me.removeClass("tree");
				me.removeData("tree-defaults");
				me.empty();
			});
		} else if ("reload" == command) {
			return this.each(function(index, element) {
				var me = $(this);
				var defaults = getDefaults(me);
				if (typeof (options) == "string")
					options = JSON.parse(options);
				defaults = $.extend(true, {}, defaults, options);
				defaults.data = options.data;
				generateTree(me, defaults);
			});
		} else if ("getSelectedNodes" == command) {
			var result = [];
			this.each(function(index, element) {
				var me = $(this);
				var selectedNodes = me.find("a.node.on");
				for (var item of selectedNodes) {
					var jsonstr = decodeURI($(item).data("node"));
					result.push(JSON.parse(jsonstr));
				}
			});
			return result;
		} else if ("select" == command) {
			var nodeId = null;
			if (typeof (options) == "string")
				nodeId = options;
			else
				return null;

			this.each(function(index, element) {
				var me = $(this);
				var nodeObj = getNodeObj(nodeId, me);
				nodeObj.parents("li").each(function(i, e) {
					var nodeId = $(this).prop("id");
					nodeId = nodeId.replace("node-", "");
					expand(nodeId, me);
				});

				$("a.node", me).removeClass("on");
				nodeObj.children("a.node").addClass("on");
			});
		} else if ("addNode" == command) {
			this.each(function(index, element) {
				var defaults = JSON.parse(decodeURI($(element).data("tree-defaults")));
				var target = getNodeObj(options.targetId, $(element));
				var html = "";
				if (!target.data("has-child")) {
					target.data("has-child", true);
					target = $("<ul></ul>").appendTo(target);
				} else {
					target = $("ul", target);
				}
				target.append(generateNode(options.data, defaults));
				if (!isNull(options.data.nodeOpen) && typeof (options.data.nodeOpen) == "function") {
					$("#node-" + options.data.id + " > a.icon", target).bind(defaults.mode, function(event) {
						var nodeObj = $(this).parent();
						var node = JSON.parse(decodeURI($("a.node", nodeObj).data("node")));
						if (nodeObj.hasClass("node-close")) {
							expand(node.id, $(element));
						} else {
							collapse(node.id, $(element));
						}
						if (isNull(options.data.nodeOpen) && typeof (options.data.nodeOpen) == "function") {
							options.data.nodeOpen(node);
						}
					});
				}
				if (!isNull(options.data.callback) && typeof (options.data.callback) == "function") {
					$("#node-" + options.data.id + " > a.node", target).bind("click", function(event) {
						$("a.node", element).removeClass("on");
						$(this).addClass("on");
						options.data.callback(options.data);
					});
				}
			});
		} else if ("removeNode" == command) {
			this.each(function(index, element) {
				var nodeId = null;
				if (typeof (options) == "string")
					nodeId = options;
				else
					return null;

				var defaults = JSON.parse(decodeURI($(element).data("tree-defaults")));
				var target = getNodeObj(nodeId, $(element));
				$("#node-" + nodeId, target).remove();
			});
		} else if ("getRootNode" == command) {
			var result = [];
			this.each(function(index, element) {
				var nodeData = getNodeObj("root", $(this)).children("a.node").data("node");
				result.push(JSON.parse(decodeURI(nodeData)));
			});
			return result;
		} else if ("getNodeObj" == command) {
			var nodeId = null;
			if (typeof (options) == "string")
				nodeId = options;
			else
				return false;

			var result = [];
			this.each(function(index, element) {
				result.push(getNodeObj(nodeId, $(this)));
			});
			return result;
		} else if ("getNode" == command) {
			var nodeId = null;
			if (typeof (options) == "string")
				nodeId = options;
			else
				return null;

			var result = [];
			this.each(function(index, element) {
				var nodeData = getNodeObj(nodeId, $(this)).children("a.node").data("node");
				result.push(JSON.parse(decodeURI(nodeData)));
			});
			return result;
		} else if ("getParentNodeObj" == command) {
			var nodeId = null;
			if (typeof (options) == "string")
				nodeId = options;
			else
				return false;

			var result = [];
			this.each(function(index, element) {
				result.push(getParentNodeObj(nodeId, $(this)));
			});
			return result;
		} else if ("getParentNode" == command) {
			var nodeId = null;
			if (typeof (options) == "string")
				nodeId = options;
			else
				return false;

			var result = [];
			this.each(function(index, element) {
				var nodeData = getParentNodeObj(nodeId, $(this)).children("a.node").data("node");
				result.push(JSON.parse(decodeURI(nodeData)));
			});
			return result;
		} else if ("getChildrenNode" == command) {
			var nodeId = null;
			if (typeof (options) == "string")
				nodeId = options;
			else
				return false;

			var result = [];
			this.each(function(index, element) {
				var nodeData = getNodeObj(nodeId, $(this)).children("a.node").data("node");
				result.push(JSON.parse(decodeURI(nodeData)).children);
			});
			return result;
		} else if ("expand" == command) {
			var nodeId = null;
			if (typeof (options) == "string")
				nodeId = options;
			else
				return false;

			this.each(function(index, element) {
				expand(nodeId, $(this));
			});
		} else if ("collapse" == command) {
			var nodeId = null;
			if (typeof (options) == "string")
				nodeId = options;
			else
				return false;

			this.each(function(index, element) {
				collapse(nodeId, $(this));
			});
		} else if ("expand" == command) {
			var nodeId = null;
			if (typeof (options) == "string")
				nodeId = options;
			else
				return false;

			this.each(function(index, element) {
				expand(nodeId, $(this));
			});
		} else if ("collapseAll" == command) {
			this.each(function(index, element) {
				collapseAll($(this));
			});
		} else if ("enableAll" == command) {
			this.each(function(index, element) {
				enableAll($(this));
			});
		} else if ("disable" == command) {
			var nodeId = null;
			if (typeof (options) == "string")
				nodeId = options;
			else
				return false;

			this.each(function(index, element) {
				disable(nodeId, $(this));
			});
		} else { // command == create
			options = command;
			return this.each(function(index, element) {
				var me = $(this);
				var defaults = {
					data: null,
					icon: {
						open: "fas fa-caret-down fa-fw",
						close: "fas fa-caret-right fa-fw",
						none: "fas fa-fw",
						node: null
					},
					mode: "click",
					multiSelect: false,
					showHiddenNode: false,
					nodeOpen: null,
					callback: null
				};
				if (typeof (options) == "string")
					options = JSON.parse(options);
				defaults = $.extend(true, {}, defaults, options);
				generateTree(me, defaults);
			});
		}

		function generateTree(treeElement, defaults) {
			treeElement.addClass("tree");
			treeElement.data("tree-defaults", encodeURI(JSON.stringify(defaults)));

			var html = "<ul>";
			if (defaults.data == null || defaults.data == undefined)
				return false;
			if (Array.isArray(defaults.data)) {
				for (var i = 0; i < defaults.data.length; i++) {
					html += generateNode(defaults.data[i], defaults);
				}
			} else {
				html += generateNode(defaults.data, defaults);
			}
			html += "</ul>"
			treeElement.html(html);

			treeBindEvent(treeElement, defaults);
		}

		function treeBindEvent(treeElement, defaults) {
			$("a.icon", treeElement).bind(defaults.mode, function(event) {
				var nodeObj = $(this).parent();
				if (nodeObj.prop("disabled")) return;
				
				var node = JSON.parse(decodeURI($("a.node", nodeObj).data("node")));
				if (nodeObj.hasClass("node-close")) {
					if (node.leaf == "false")
						expand(node.id, treeElement);
				} else {
					collapse(node.id, treeElement);
				}
				if (isNull(defaults.nodeOpen) && typeof (defaults.nodeOpen) == "function") {
					defaults.nodeOpen(node);
				}
			});

			$("a.node", treeElement).bind("click", function(event) {
				var nodeObj = $(this).parent();
				if (nodeObj.prop("disabled")) return;
				
				if (!defaults.multiSelect) $("a.node", treeElement).removeClass("on");
				$(this).toggleClass("on");
				if (!isNull(defaults.callback) && typeof (defaults.callback) == "function") {
					var node = JSON.parse(decodeURI($(this).data("node")));
					defaults.callback(node);
				}
			});
		}

		function generateNode(node, defaults) {
			var html = "";
			if (defaults.showHiddenNode || node.visible == "true") {
				var icon = $.extend(true, {}, defaults.icon, node.icon);
				html += "<li id=\"node-" + node.id + "\" class=\"node-close\" data-has-child=\"" + (!(node.children == null || node.children == undefined || node.children.length == 0)) + "\">";
				html += "<a href=\"javascript: void(0);\" class=\"icon\">";
				html += "<span class=\"" + (node.leaf == "true" ? icon.none : icon.close) + "\" aria-hidden=\"true\"></span>";
				html += "</a>";
				html += "<a href=\"javascript: void(0);\" class=\"node " + (node.enable == "true" ? "enable" : "disable") + "\" title=\"" + node.comment + "\" data-node=\"" + encodeURI(JSON.stringify(node)) + "\">";
				if (!isNull(icon.node)) {
					html += "<span class=\"" + icon.node + "\" aria-hidden=\"true\"></span> ";
				}
				html += "<span class=\"text\">"  + node.text + "</span>";
				html += "</a>";
				if (node.leaf == "false" && !isNull(node.children)) {
					html += "<ul>";
					for (var i = 0; i < node.children.length; i++) {
						html += generateNode(node.children[i], defaults);
					}
					html += "</ul>";
				}
				html += "</li>";
			}
			return html;
		}

		function getNodeObj(nodeId, treeElement) {
			return $("#node-" + nodeId, treeElement);
		}

		function getParentNodeObj(nodeId, treeElement) {
			return $("#node-" + nodeId, treeElement).parent().parent();
		}

		function getDefaults(treeElement) {
			return JSON.parse(decodeURI(treeElement.data("tree-defaults")));
		}

		function expand(nodeId, treeElement) {
			var defaults = getDefaults(treeElement);
			var nodeObj = getNodeObj(nodeId, treeElement);
			// if (!nodeObj.data("has-child")) return false;

			var node = JSON.parse(decodeURI($("a.node", nodeObj).data("node")));
			var iconObj = nodeObj.children("a.icon").children("span");
			var icon = $.extend(true, {}, defaults.icon, node.icon);
			if (nodeObj.hasClass("node-close")) {
				iconObj.removeClass(icon.close);
				iconObj.addClass(icon.open);
				nodeObj.removeClass("node-close");
				nodeObj.children("ul").slideDown(function() {
					$(this).show();
				});
				treeElement.trigger("tree.node.open", node);
			}
		}
		
		function expandAll(treeElement) {
			var defaults = getDefaults(treeElement);
			$("li", treeElement).each(function(index, element) {
				var nodeObj = $(this);
				var node = JSON.parse(decodeURI($("a.node", nodeObj).data("node")));
				var iconObj = nodeObj.children("a.icon").children("span");
				var icon = $.extend(true, {}, defaults.icon, node.icon);
				if (nodeObj.hasClass("node-close")) {
					iconObj.removeClass(icon.close);
					iconObj.addClass(icon.open);
					nodeObj.removeClass("node-close");
					nodeObj.children("ul").slideDown(function() {
						$(this).show();
					});
					treeElement.trigger("tree.node.open", node);
				}
			});
		}

		function collapse(nodeId, treeElement) {
			var defaults = getDefaults(treeElement);
			var nodeObj = getNodeObj(nodeId, treeElement);
			// if (!nodeObj.data("has-child")) return false;

			var node = JSON.parse(decodeURI($("a.node", nodeObj).data("node")));
			var iconObj = nodeObj.children("a.icon").children("span");
			var icon = $.extend(true, {}, defaults.icon, node.icon);
			iconObj.removeClass(icon.open);
			iconObj.addClass(icon.close);
			nodeObj.addClass("node-close");
			nodeObj.children("ul").slideUp(function() {
				$(this).hide();
			});
			treeElement.trigger("tree.node.close", node);
		}
		
		function collapseAll(treeElement) {
			var defaults = getDefaults(treeElement);
			$("li", treeElement).each(function(index, element) {
				var nodeObj = $(this);
				var node = JSON.parse(decodeURI($("a.node", nodeObj).data("node")));
				if (node.leaf != "true") {
					var iconObj = nodeObj.children("a.icon").children("span");
					var icon = $.extend(true, {}, defaults.icon, node.icon);
					iconObj.removeClass(icon.open);
					iconObj.addClass(icon.close);
					nodeObj.addClass("node-close");
					nodeObj.children("ul").slideUp(function() {
						$(this).hide();
					});
					treeElement.trigger("tree.node.close", node);
				}
			});
		}
		
		function enable(nodeId, treeElement) {
			var nodeObj = getNodeObj(nodeId, treeElement);
			nodeObj.toggleClass("disabled", false).prop("disabled", false);
			$("a.node", nodeObj).removeClass("disable").addClass("enable");
		}
		
		function disable(nodeId, treeElement) {
			var nodeObj = getNodeObj(nodeId, treeElement);
			nodeObj.toggleClass("disabled", true).prop("disabled", true);
			$("a.node", nodeObj).removeClass("enable").addClass("disable");
		}
	},
	/**
	 * Limited TextArea By Byte and Length jQuery Plugin
	 * <pre>
	 * ex)
	 * - Basic
	 * <textarea class="form-control" id="basic" name="description" placeholder="설명을 입력 해 주세요." rows="5"></textarea>
	 * 
	 * $("#basic").limitedTextarea();
	 * 
	 * - Extension
	 * <textarea class="form-control" id="extend" name="description" placeholder="설명을 입력 해 주세요." rows="5"></textarea>
	 * 
	 * $("#extend").limitedTextarea({
	 * 		unit: "length",
	 * 		limit: 500
	 * });
	 * </pre>
	 * @author 신춘호(sch0718@naver.com)
	 * @dependency jQuery
	 */
	limitedTextarea: function(command, options) {
		if ("update" != command && (options == null || options == undefined)) {
			options = command;
			command = "create";
		}
		if ("create" == command) {
			return this.each(function(index, element) {
				var me = $(element);
				var defaults = {
					unit: "bytes",
					limit: 2000
				};
				if (typeof (options) == "string")
					options = JSON.parse(options);
				defaults = $.extend(true, defaults, options);

				if (!me.hasClass("limited-textarea")) {
					me.addClass("limited-textarea");
					me.data("unit", defaults.unit);
					me.data("limit", defaults.limit);
					me.bind("keyup", function(event) {
						limitedTextareaUpdateTrigger(me, defaults);
					});
					me.bind("change", function(event) {
						limitedTextareaUpdateTrigger(me, defaults);
					});
					var html = "<label class=\"limited-textarea-label\"><span>0</span> / " + defaults.limit + " " + defaults.unit + "</label>";
					me.after(html);

					limitedTextareaUpdateTrigger(me, defaults);
				}
			});
		} else if ("update" == command) {
			return this.each(function(index, element) {
				var me = $(element);
				limitedTextareaUpdateTrigger(me);
			});
		}

		function limitedTextareaUpdateTrigger(obj, options) {
			var me = obj;
			var text = me.val();
			var unit = options != null && options != undefined ? options.unit : me.data("unit");
			var limit = options != null && options != undefined ? options.limit : me.data("limit");
			var length = -1;
			if ("bytes" == unit) {
				length = text.byteLength();
				while (limit < text.byteLength()) {
					length--;
					text = text.substring(0, length);
				}
				length = text.byteLength();
			} else {
				length = text.length;
				while (limit < text.length) {
					length--;
					text = text.substring(0, length);
				}
				length = text.length;
			}
			me.val(text);
			var target = $("span", me.next());
			target.text(length);
		}
	},
	/**
	 * Designed Bootstrap Tab Panel jQuery Plugin
	 * <pre>
	 * ex)
	 * - Basic
	 * <div class="panel panel-default">
	 * 		<div id="basic" class="panel-body tab-area"></div>
	 * 		<div class="panel-footer">
	 * 			<form id="basic-form" name="basic-form" class="form-horizontal" onsubmit="javascript: return addTab(this);">
	 * 				<div class="input-group" role="group">
	 * 					<select name="url" class="selectpicker" data-width="50px">
	 * 						<option value="getbootstrap.com/" data-id="bootstrap" data-icon="fa fa-window-maximize">Bootstrap</option>
	 * 						<option value="fontawesome.io" data-id="fontawesome" data-icon="fa fa-window-maximize">Font Awesome</option>
	 * 						<option value="jquery.com" data-id="jquery" data-icon="fa fa-window-maximize">jQuery</option>
	 * 						<option value="www.webjars.org" data-id="webjars" data-icon="fa fa-window-maximize">WebJars</option>
	 * 					</select>
	 * 					<span class="input-group-btn">
	 * 						<button type="submit" class="btn btn-default" title="탭 추가">
	 * 							<span class="fa fa-plus" aria-hidden="true"></span> 탭 추가
	 * 						</button>
	 * 					</span>
	 * 				</div>
	 * 			</form>
	 * 		</div>
	 * </div>
	 * 
	 * $("#basic").tabPanel();
	 * 
	 * function addTab(form) {
	 * 		var selectedOption = $("option:selected", form.url);
	 * 		var tab = $("#basic").tabPanel("addTab", {
	 * 			id: selectedOption.data("id"),
	 * 			text: selectedOption.text(),
	 * 			comment: selectedOption.text() + " - " + selectedOption.attr("value"),
	 * 			icon: selectedOption.data("icon")
	 * 		});
	 * 		$("#tab-" + selectedOption.data("id")).html("<div class=\"embed-responsive embed-responsive-16by9\"><iframe class=\"embed-responsive-item\" src=\"http://" + selectedOption.attr("value") + "\"></iframe></div>");
	 * 		return false;
	 * }
	 * 
	 * - Extension
	 * Data: [{"id":"01","text":"탭01","comment":"첫번째 탭입니다."},{"id":"02","text":"탭02","comment":"두번째 탭입니다."},{"id":"03","text":"탭03","comment":"세번째 탭입니다."}]
	 * 
	 * <div id="extend" class="tab-area"></div>
	 * 
	 * $("#extend").tabPanel({
	 * 		icon: "fa fa-window-restore",
	 * 		closable: true,
	 * 		data: extendData
	 * });
	 * </pre>
	 * @author 신춘호(sch0718@naver.com)
	 * @dependency jQuery, bootstrap
	 */
	tabPanel: function(command, options) {
		var defaults = {
			icon: null,
			closable: false
		};

		if ("destroy" == command) {
			return this.each(function(index, element) {
				destroy($(this));
			});
		} else if ("getTab" == command) {
			var tabId = null;
			if (typeof (options) == "string")
				tabId = options;
			else
				return false;

			var tabList = $("ul.nav.nav-tabs", this).first();
			return $("#tab-" + tabId);
		} else if ("selectTab" == command) {
			var tabId = null;
			if (typeof (options) == "string")
				tabId = options;
			else
				return false;

			var tabList = $("ul.nav.nav-tabs", this).first();
			return $("a[href='#tab-" + tabId + "']", tabList).tab("show");
		} else if ("addTab" == command) {
			if (typeof (options) == "string")
				options = JSON.parse(options);

			// var options = $.extend(true, {}, defaults, options);
			return addTab(this, defaults, options);
		} else if ("removeTab" == command) {
			var tabId = null;
			if (typeof (options) == "string")
				tabId = options;
			else
				return false;

			removeTab(this, tabId);
		} else {
			return this.each(function(index, element) {
				options = command;
				create($(this), options);
			});
		}

		function create(me, options) {
			var tabList = me.append("<ul class=\"nav nav-tabs\" role=\"tablist\"></ul>");
			var tabPanel = me.append("<div class=\"tab-content\"></div>");

			if (typeof (options) == "string")
				options = JSON.parse(options);

			var options = $.extend(true, {}, defaults, options);
			$.each(options.data, function(index, value) {
				addTab(me, options, value);
			});
		}

		function destroy(me) {
			me.empty();
		}

		function addTab(me, options, data) {
			var tabList = $("ul.nav.nav-tabs", me).first();
			var tabPanel = $("div.tab-content", me).first();

			var closable = isNull(data.closable) ? options.closable : data.closable;
			var icon = isNull(data.icon) ? options.icon : data.icon;

			var tabElement = $("#tab-" + data.id, tabPanel);
			if (tabElement.length == 0) {
				var html = "";
				html += "<li role=\"presentation\" class=\"" + (closable ? "closable" : "") + "\">";
				html += "<a href=\"#tab-" + data.id + "\" aria-controls=\"" + data.text + "\" role=\"tab\" data-toggle=\"tab\" title=\"" + data.comment + "\">";
				if (!isNull(icon)) {
					html += "<span class=\"" + icon + "\" aria-hidden=\"true\"></span> ";
				}
				html += data.text;
				html += "</a>";
				if (closable) {
					html += "<button type=\"button\" class=\"times\" aria-label=\"Close\"><span class=\"fa fa-times-circle\" aria-hidden=\"true\"></span></button>";
				}
				html += "</li>";
				tabList.append(html);
				tabPanel.append("<div role=\"tabpanel\" class=\"tab-pane fade\" id=\"tab-" + data.id + "\"></div>");
			}
			var selectedTab = me.tabPanel("selectTab", data.id);
			if (closable) {
				$("button.times", selectedTab.parent()).bind("click", function(event) {
					me.tabPanel("removeTab", data.id);
				});
			}
			return selectedTab;
		}

		function removeTab(me, tabId) {
			var tabList = $("ul.nav.nav-tabs", me).first();
			var tabPanel = $("div.tab-content", me).first();

			$("li > a[href='#tab-" + tabId + "']", tabList).parent().remove();
			$("#tab-" + tabId, tabPanel).remove();
		}
	},
	/**
	 * Ticker(Text printing animation effect)
	 * <pre>
	 * <span id="basic" data-period="2000" data-rotate-text="IMAGINE &amp; CREATE"></span>
	 * 
	 * $("#basic").tick();
	 * </pre>
	 * @author 신춘호(sch0718@naver.com)
	 * @dependency jQuery
	 */
	tick: function(options) {
		return this.each(function(index, element) {
			element = $(element);
			
			var defaults = {
				rotateText: null,
				period: 2000,
				loopNum: 0,
				text: "",
				isDeleting: false
			};

			if (typeof (options) == "string")
				options = JSON.parse(options);

			var options = $.extend(true, {}, defaults, options);

			if (!isNull(element.data("period"))) {
				options.period = element.data("period");
			}
			if (!isNull(element.data("rotate-text"))) {
				options.rotateText = element.data("rotate-text");
			}
			if (element.text() != "") {
				options.rotateText = element.text();
			}
			
			tick();
			
			function tick() {
				var fullText = options.rotateText;
	
				if (options.isDeleting) {
					options.text = fullText.substring(0, options.text.length - 1);
				} else {
					options.text = fullText.substring(0, options.text.length + 1);
				}
	
				element.text(options.text);
			
				var delta = 200 - Math.random() * 100;

				if (options.isDeleting) {
					delta /= 2;
				}

				if (!options.isDeleting && options.text === fullText) {
					delta = options.period;
					options.isDeleting = true;
				} else if (options.isDeleting && options.text === "") {
					options.isDeleting = false;
					options.loopNum += 1;
					delta = 500;
				}

				setTimeout(function() {
					tick();
				}, delta);
			}
		});
	},
	/**
	 * jQuery Plugin to inject dependencies between Form Tags
	 * <pre>
	 * ex)
	 * - Basic
	 * <form id="basic" name="basic" onsubmit="javascript: doSubmit();">
	 * 		<label>
	 * 			<input type="radio" name="basicRadio" value="true" checked="checked" data-dependency-trigger="[name='basicRadioTrigger']:input"> 사용
	 * 		</label>
	 * 		<label>
	 * 			<input type="radio" name="basicRadio" value="false" data-dependency-trigger="[name='basicRadioTrigger']:input"> 미사용
	 * 		</label>
	 * 		<textarea name="basicRadioTrigger" class="form-control" placeholder="사용여부에 따라 상태가 변경됩니다." rows="3"></textarea>
	 * </form>
	 * 
	 * $("#basic").dependency();
	 * 
	 * - Extension
	 * <form id="extend" name="extend" class="form-inline" onsubmit="javascript: doSubmit();">
	 * 		<label class="checkbox-inline">
	 * 			<input type="checkbox" name="applyAll" value="true" class="checkbox" data-dependency-trigger="input[name!='applyAll']input[name^='apply']" data-dependency-trigger-action="applyAll" /> 전체 동의
	 * 		</label>
	 * 		<label class="checkbox-inline">
	 * 			<input type="checkbox" name="apply" value="true" class="checkbox" data-dependency-trigger="input[name='applyAll']" data-dependency-trigger-action="doToggleCheckboxAll" /> 1번 동의
	 * 		</label>
	 * 		<label class="checkbox-inline">
	 * 			<input type="checkbox" name="apply" value="true" class="checkbox" data-dependency-trigger="input[name='applyAll']" data-dependency-trigger-action="doToggleCheckboxAll" /> 2번 동의
	 * 		</label>
	 * 		<label class="checkbox-inline">
	 * 			<input type="checkbox" name="apply" value="true" class="checkbox" data-dependency-trigger="input[name='applyAll']" data-dependency-trigger-action="doToggleCheckboxAll" /> 3번 동의
	 * 		</label>
	 * 		<label class="checkbox-inline">
	 * 			<input type="checkbox" name="apply" value="true" class="checkbox" data-dependency-trigger="input[name='applyAll']" data-dependency-trigger-action="doToggleCheckboxAll" /> 4번 동의
	 * 		</label>
	 * </form>
	 * 
	 * $("#extend").dependency();
	 * 
	 * function applyAll(element, trigger) {
	 *		var checked = element.prop("checked");
	 *		trigger.prop("checked", checked);
	 * }
	 * 
	 * function doToggleCheckboxAll(element, trigger) {
	 * 		var checkbox = $("[name='" + element.prop("name") + "']:checkbox");
	 * 		trigger.prop("checked", checkbox.length == checkbox.filter(":checked").length);
	 * 		trigger.checkbox("update");
	 * }
	 * </pre>
	 * @author 신춘호(sch0718@naver.com)
	 * @dependency jQuery
	 */
	dependency: function() {
		var defaults = {
			radio: {
				prop: "value",
				triggerAction: function(trigger, value) {
					trigger.prop("disabled", !value);
				}
			},
			checkbox: {
				prop: "checked",
				triggerAction: function(trigger, value) {
					trigger.prop("disabled", !value);
				}
			},
			select: {
				prop: "value",
				triggerAction: function(trigger, value) {
					trigger.prop("disabled", !value);
				}
			}
		};
		
		return this.each(function(index, element) {
			var me = $(this);

			generate(me);
		});
		
		function generate(element) {
			if (element.is(":input")) {
				var trigger = $(element.data("dependency-trigger"));
				var target = $(element.data("dependency-target"));
				
				if (!isNull(trigger)) {
					if (element.is(":radio")) {
						element.bind("change", function(event) {
							var action = {
								triggerAction: $(this).data("dependency-trigger-action")
							};
							action = $.extend(true, {}, defaults.radio, action);
							if (typeof action.triggerAction == "function") {
								action.triggerAction(trigger, $(this).prop(action.prop) == "true" ? true : false);
							} else if (typeof action.triggerAction == "string") {
								eval(action.triggerAction)($(this), trigger);
							}
						});
					} else if (element.is(":checkbox")) {
						element.bind("change", function(event) {
							var action = {
								triggerAction: $(this).data("dependency-trigger-action")
							};
							action = $.extend(true, {}, defaults.checkbox, action);
							if (typeof action.triggerAction == "function") {
								action.triggerAction(trigger, $(this).prop(action.prop));
							} else if (typeof action.triggerAction == "string") {
								eval(action.triggerAction)($(this), trigger);
							}
						});
					} else if (element.is("select")) {
						element.bind("change", function(event) {
							var action = {
								triggerAction: $(this).data("dependency-trigger-action")
							};
							action = $.extend(true, {}, defaults.select, action);
							if (typeof action.triggerAction == "function") {
								action.triggerAction(trigger, $(this).prop(action.prop) == "true" ? true : false);
							} else if (typeof action.triggerAction == "string") {
								eval(action.triggerAction)($(this), trigger);
							}
						});
					} else if (element.is(":text") || element.is("textarea")) {
						element.bind("keyup", function(event) {
							var action = {
								triggerAction: $(this).data("dependency-trigger-action")
							};
							if (typeof action.triggerAction == "string") {
								eval(action.triggerAction)($(this), trigger);
							}
						});
					}
				}
				
				if (!isNull(target)) {
					if (target.is(":radio")) {
						target.bind("change", function(event) {
							var action = {
								targetAction: element.data("dependency-target-action")
							};
							if (typeof action.targetAction == "function") {
								action.targetAction(element, $(this).prop(action.prop) == "true" ? true : false);
							} else if (typeof action.targetAction == "string") {
								eval(action.targetAction)(element, $(this));
							}
						});
					} else if (target.is(":checkbox")) {
						target.bind("change", function(event) {
							var action = {
								targetAction: element.data("dependency-target-action")
							};
							action = $.extend(true, {}, defaults.checkbox, action);
							if (typeof action.action == "function") {
								action.targetAction(element, $(this).prop(action.prop));
							} else if (typeof action.action == "string") {
								eval(action.targetAction)(element, $(this));
							}
						});
					} else if (target.is("select")) {
						action = $.extend(true, {}, defaults.select, action);
						target.bind("change", function(event) {
							if (typeof action.action == "function") {
								action.action(element, $(this).prop(action.prop) == "true" ? true : false);
							} else if (typeof action.action == "string") {
								eval(action.action)(element, $(this));
							}
						});
					} else {
						// TODO trigger와 action을 필수로 지정하도록 하고 그에 따른 실행이 가능하도록 한다.
					}
				}
			} else {
				$("[data-dependency-trigger]:input, [data-dependency-target]:input", element).each(function(index, element) {
					generate($(this));
				});
			}
		}
	},
	/**
	 * Star Rating
	 * <pre>
	 * ex)
	 * <div id="basic" class="form-group"></div>
	 * 
	 * $("#basic").rating();
	 * $("#basic").rating({
	 * 		value: 6
	 * });
	 * </pre>
	 * @author 신춘호(sch0718@naver.com)
	 * @dependency jQuery, bootstrap, font-awesome
	 */
	rating: function(command, options) {
		var defaults = {
			name: "rating",
			icon: {
				over: "fa fa-star fa-2x",
				out: "fa fa-star-o fa-2x"
			},
			size: 5,
			max: 10,
			min: 0,
			value: 0
		};
		
		if (![ "update", "enable", "disable" ].includes(command) && isNull(options)) {
			options = command;
			command = "create";
		}
		if ("create" == command || "update" == command) {
			return this.each(function(index, element) {
				var me = $(this);
	
				if (typeof (options) == "string")
					options = JSON.parse(options);
				options = $.extend(true, {}, defaults, options);
	
				generateComponent(me, options);
				eventBinding(me, options);
			});
		} else if ("disable" == command) {
			return this.each(function(index, element) {
				var me = $(this);
	
				me.addClass("disabled");
				$(":radio", me).prop("disabled", true);
			});
		} else if ("enable" == command) {
			return this.each(function(index, element) {
				var me = $(this);
	
				me.removeClass("disabled");
				$(":radio", me).prop("disabled", false);
			});
		}
		
		function generateComponent(element, options) {
			var html = "";
			for (var i = 0; i < options.size; i++) {
				var value = (options.min + options.max) / options.size * (i + 1);
				html += "<label class=\"btn btn-default\">";
				html += "<input type=\"radio\" name=\"" + options.name + "\" value=\"" + value + "\" autocomplete=\"off\" />";
				html += "</label>";
			}
			element.addClass("rating");
			element.attr("data-toggle", "buttons");
			element.html(html);
			markRating(options.value, element, options);
		}
		
		function eventBinding(element, options) {
			$(":radio", element).bind("change", function(event) {
				markRating($(this).val(), element, options);
			});
		}
		
		function markRating(value, element, options) {
			$(":radio", element).each(function (index, element) {
				if ($(this).prop("disabled")) return;
				
				if (parseInt($(this).val()) <= parseInt(value)) {
					$(this).parent().removeClass(options.icon.out).addClass(options.icon.over);
				} else {
					$(this).parent().removeClass(options.icon.over).addClass(options.icon.out);
				}
			});
		}
	},
	/**
	 * Data Grid의  Sorting 정보를 visualization 하고, event를 binding 하는 Plugin
	 * <pre>
	 * ex)
	 * $("table").sort({
	 * 	sort: "createdBy,desc"
	 * });
	 * 
	 * $("table").sort({
	 * 	sort: [ "id,asc", "serviceCategory,asc" ]
	 * });
	 * 
	 * $("table").sort({
	 * 	sort: {
	 * 		property: "worker",
	 * 		direction: "desc"
	 * 	}, callback: function(prop, direction) {
	 * 		var form = $("#searchForm");
	 * 		form.find("input[name='sort']").val(prop + "," + direction);
	 * 		doSearch();
	 * 	}
	 * });
	 * 
	 * $("table").sort({
	 * 	sort: [ {
	 * 		property: "id",
	 * 		direction: "asc"
	 * 	}, {
	 * 		property: "createdDate",
	 * 		direction: "desc"
	 * 	} ]
	 * );
	 * </pre>
	 */
	sort: function(command, options) {
		if (![ "update" ].includes(command) && isNull(options)) {
			options = command;
			command = "create";
		}
		const defaults = {
			icon: {
				none: "fas fa-sort",
				asc: "fas fa-sort-up",
				desc: "fas fa-sort-down",
				inner: {
					asc: "",
					desc: ""
				}
			},
			sort: {
				property: null,
				direction: null
			},
			callback: function(prop, direction) {
			}
		};
		if ("create" == command) {
			return this.each(function(index, element) {
				const me = $(this);

				if (typeof (options) == "string")
					options = JSON.parse(options);
				options = $.extend(true, {}, defaults, options);
				generateComponent(me, options);
			});
		} else if ("update" == command) {
			return this.each(function(index, element) {
				const me = $(this);

				if (typeof (options) == "string")
					options = JSON.parse(options);
				options = $.extend(true, {}, defaults, options);
				generateComponent(me, options);
			});
		}
			
		function generateComponent(element, options) {
			$("[data-sort-prop]", element).each(function (index, element) {
				renderComponent($(element), options);
				eventBinding($(element), options);
			});
		}
		
		function renderComponent(element, options) {
			const prop = element.data("sort-prop");
			const text = element.text();
			let html = text;
			html += "<a href=\"javascript: void(0);\" class=\"sort-action " + getSortClass(prop, options) + "\">";
			html += "<i class=\"" + options.icon.inner.asc + "\"></i>";
			html += "<i class=\"" + options.icon.inner.desc + "\"></i>";
			html += "</a>";
			element.html(html);
			element.addClass("sort-wrap");
		}
		
		function eventBinding(target, options) {
			target.off("click");
			target.bind("click", function(event) {
				var sortAction = $(".sort-action", $(this));
				if (sortAction.hasClass(options.icon.asc)) {
					target.trigger("desc.sort");
				} else if (sortAction.hasClass(options.icon.desc)) {
					target.trigger("asc.sort");
				} else {
					target.trigger("asc.sort");
				}
			});
			
			target.off("asc.sort");
			target.bind("asc.sort", function(event) {
				const selectedProp = $(this).data("sort-prop");
				$(".sort-action").each(function(index, element) {
					$(this).removeClass();
					if (selectedProp == $(this).parent().data("sort-prop")) $(this).addClass("sort-action " + options.icon.asc);
					else $(this).addClass("sort-action " + options.icon.none);
				});
				if (!isNull(options.callback)) {
					options.callback.call(this, selectedProp, "asc");
				}
			});
				
			target.off("desc.sort");
			target.bind("desc.sort", function(event) {
				const selectedProp = $(this).data("sort-prop");
				$(".sort-action").each(function(index, element) {
					$(this).removeClass();
					if (selectedProp == $(this).parent().data("sort-prop")) $(this).addClass("sort-action " + options.icon.desc);
					else $(this).addClass("sort-action " + options.icon.none);
				});
				if (!isNull(options.callback)) {
					options.callback.call(this, selectedProp, "desc");
				}
			});
		}
		
		function getSortClass(prop, options) {
			let sortClass = options.icon.none;
			let sort = null;
			if (Array.isArray(options.sort)) {
				for (var i in options.sort) {
					if (typeof (options.sort[i]) == "string") sort = parse(options.sort[i]);
					else sort = options.sort[i];
					
					if (prop == sort.property) {
						sortClass = getClass(sort, options.icon);
						break;
					}
				}
			} else {
				if (typeof (options.sort) == "string") sort = parse(options.sort);
				else sort = options.sort;
				if (prop == sort.property) sortClass = getClass(sort, options.icon);
			}
			
			return sortClass;
			
			function parse(str) {
				const array = str.split(",");
				return {
					property: array[0],
					direction: array[1]
				};
			}
			
			function getClass(sort, icon) {
				return sort.direction.toLowerCase() == "asc" ? icon.asc : icon.desc;
			}
		}
	},
	pagination: function(command, options) {
		if (![ "update" ].includes(command) && isNull(options)) {
			options = command;
			command = "create";
		}
		
		const defaults = {
			icons: {
				first: "fas fa-fast-backward",
				prev: "fas fa-backward",
				next: "fas fa-forward",
				last: "fas fa-fast-forward",
				ellipsis: "fas fa-ellipsis-h"
			},
			labels: {
				first: "처음",
				prev: "이전",
				next: "다음",
				last: "마지막",
				ellipsis: ""
			},
			pageOffset: 5,
			useEllipsis: true
		};
		
		if ("create" == command) {
			return this.each(function(index, element) {
				const me = $(this);

				if (typeof (options) == "string")
					options = JSON.parse(options);
				options = $.extend(true, {}, defaults, options);
				generateComponent(me, options);
			});
		} else if ("update" == command) {
			return this.each(function(index, element) {
				const me = $(this);

				if (typeof (options) == "string")
					options = JSON.parse(options);
				options = $.extend(true, {}, defaults, options);
				generateComponent(me, options);
			});
		}
		
		function generateComponent(element, options) {
			const data = options.data;
			const startNum = data.number - options.pageOffset < 0 ? 0 : data.number - options.pageOffset;
			const endNum = data.number + options.pageOffset > data.totalPages - 1 ? (data.totalPages == 0 ? 0 : data.totalPages) : data.number + options.pageOffset + 1;
			let $html = "";
			//$html += "<li class=\"prev page-item" + (data.isFirst ? " disabled" : "") + "\">";
			//$html += "<a href=\"javascript:;\"" + (data.isFirst ? "" : " onclick=\"javascript: Pagination.goPage(0);\"") + " aria-label=\"" + options.labels.first + "\" class=\"page-link\">";
			//$html += "<span>이전</span>";
			//$html += "</a>";
			//$html += "</li>";
			$html += "<li class=\"prev page-item" + (!data.hasPrevious ? " disabled" : "") + "\">";
			$html += "<a href=\"javascript:;\"" + (data.hasPrevious ? " onclick=\"javascript: Pagination.goPage(" + data.previousPageable.pageNumber + ");\"" : "") + " aria-label=\"" + options.labels.prev + "\" class=\"page-link\">";
			$html += "<span>이전</span>";
			$html += "</a>";
			$html += "</li>";
			if (options.useEllipsis && data.number - options.pageOffset > 0) {
				$html += "<li class=\"page-item disabled\">";
				$html += "<a href=\"javascript:;\" aria-label=\"" + options.labels.ellipsis + "\" class=\"page-link\">";
				$html += "<i class=\"" + options.icons.ellipsis + "\"></i> " + options.labels.ellipsis;
				$html += "</a>";
				$html += "</li>";
			}
			for (let page = startNum; page < endNum; page++) {
				$html += "<li class=\"page-item" + (page == data.number ? " active" : "") + "\">";
				$html += "<a href=\"javascript:;\" onclick=\"javascript: Pagination.goPage(" + page + ");\" aria-label=\"" + (page + 1) + "\" class=\"page-link\">" + (page + 1) + "</a>";
				$html += "</li>";
			}
			if (options.useEllipsis && data.number + options.pageOffset < data.totalPages - 1) {
				$html += "<li class=\"page-item disabled\">";
				$html += "<a href=\"javascript:;\" aria-label=\"" + options.labels.ellipsis + "\" class=\"page-link\">";
				$html += "<i class=\"" + options.icons.ellipsis + "\"></i> " + options.labels.ellipsis;
				$html += "</a>";
				$html +="</li>";
			}
			$html += "<li class=\"next page-item" + (!data.hasNext ? " disabled" : "") + "\">";
			$html += "<a href=\"javascript:;\"" + (data.hasNext ? " onclick=\"javascript: Pagination.goPage(" + data.nextPageable.pageNumber + ");\"" : "") + " aria-label=\"" + options.labels.next + "\" class=\"page-link\">";
			$html += "<span>다음</span>";
			$html += "</a>";
			$html += "</li>";
			//$html += "<li class=\"page-item" + (data.isLast ? " disabled" : "") + "\">";
			//$html += "<a href=\"javascript:;\"" + (data.isLast ? "" : " onclick=\"javascript: Pagination.goPage(" + (data.totalPages - 1) + ");\"") + " aria-label=\"" + options.labels.last + "\" class=\"page-link\">";
			//$html += "<i class=\"" + options.icons.last + "\"></i> " + options.labels.last;
			//$html += "</a>";
			//$html += "</li>";
			element.html($html);
		}
	}
});

function isNull(obj) {
	return obj == null || obj == undefined;
}

function getStringDefault(value, defaultValue) {
	return isNull(value) ? isNull(defaultValue) ? "" : defaultValue + "" : value + "";
}
