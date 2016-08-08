var ISO31661JP = ["Japan", "JP", "JPN", "JAPAN"];
var HADRLIST = ["p-region-id", "p-region", "p-locality", "p-street-address", "p-extended-address"];
var YubinBango;
(function (YubinBango) {
    var MicroformatDom = (function () {
        function MicroformatDom() {
            var _this = this;
            document.addEventListener('DOMContentLoaded', function () { _this.hadrloop(); }, false);
        }
        MicroformatDom.prototype.hadrloop = function () {
            var _this = this;
            var hadrs = document.querySelectorAll('.h-adr');
            [].map.call(hadrs, function (hadr) {
                if (_this.countryNameCheck(hadr)) {
                    var postalcode = hadr.querySelectorAll('.p-postal-code');
                    postalcode[postalcode.length - 1].addEventListener("keyup", function (e) {
                        MicroformatDom.prototype.applyDom(_this.getFormNode(e.target.parentNode));
                    }, false);
                }
            });
        };
        MicroformatDom.prototype.getFormNode = function (elm) {
            return (elm.tagName !== "FORM") ? this.getFormNode(elm.parentNode) : elm;
        };
        MicroformatDom.prototype.countryNameCheck = function (elm) {
            var a = elm.querySelector('.p-country-name');
            var arr = [a.innerHTML, a.value];
            return (arr.some(function (val) { return (ISO31661JP.indexOf(val) >= 0); }));
        };
        MicroformatDom.prototype.applyDom = function (elm) {
            var _this = this;
            var postalcode = elm.querySelectorAll('.p-postal-code');
            new YubinBango.Core(this.reduceVal(postalcode), function (address) { return _this.setAddr(elm, address); });
        };
        MicroformatDom.prototype.reduceVal = function (postalcode) {
            return [].map.call(postalcode, function (a) { return a.value; }).reduce(function (a, b) { return a + b; });
        };
        MicroformatDom.prototype.setAddr = function (elm, address) {
            var fnlist = [this.postalFormClear, this.postalFormSet];
            fnlist.map(function (fn) { return HADRLIST.map(function (val) { return fn(val, elm, address); }); });
        };
        MicroformatDom.prototype.postalFormClear = function (val, elm, data) {
            if (data) {
                var addrs = elm.querySelectorAll('.' + val);
                [].map.call(addrs, function (addr) {
                    return addr.value = '';
                });
            }
        };
        MicroformatDom.prototype.postalFormSet = function (val, elm, data) {
            var o = {
                "p-region-id": data.region_id,
                "p-region": data.region,
                "p-locality": data.locality,
                "p-street-address": data.street,
                "p-extended-address": data.extended
            };
            var addrs = elm.querySelectorAll('.' + val);
            [].map.call(addrs, function (addr) {
                return addr.value += (o[val]) ? o[val] : '';
            });
        };
        return MicroformatDom;
    }());
    YubinBango.MicroformatDom = MicroformatDom;
})(YubinBango || (YubinBango = {}));
new YubinBango.MicroformatDom();
