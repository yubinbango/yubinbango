/// <reference path="./node_modules/yubinbango-core/yubinbango-core.ts"/>

const ISO31661JP = ["Japan", "JP", "JPN", "JAPAN"];
const HADRLIST = ["p-region-id", "p-region", "p-locality", "p-street-address", "p-extended-address"];
module YubinBango {
  export class MicroformatDom {
    constructor(
      ) {
      this.hadrloop();
    }
    hadrloop() {
      // HTML内のh-adr要素のリストに対して操作を行う
      const hadrs = document.querySelectorAll('.h-adr');
      [].map.call(hadrs, (hadr) => {
        // country-name が日本かどうかチェック
        if (this.countryNameCheck(hadr)) {
          // 郵便番号の入力欄を取得
          const postalcode = hadr.querySelectorAll('.p-postal-code');
          // 郵便番号入力欄が1つの場合でも3桁-4桁で2つに分かれている場合でも両方に対応するため、それぞれのh-adr内の中の最後のpostal-codeにkeyupイベントを付与する
          postalcode[postalcode.length - 1].addEventListener("keyup", (e)=>{
            MicroformatDom.prototype.applyDom(this.getFormNode(e.target.parentNode));
          }, false);
        }
      });
    }
    getFormNode(elm){
      return (elm.tagName !== "FORM" && !elm.classList.contains("h-adr"))? this.getFormNode(elm.parentNode) : elm;
    }
    // 日本かどうかチェックする
    countryNameCheck(elm) {
      const a = elm.querySelector('.p-country-name');
      const arr:string[] = [a.innerHTML, a.value];
      return (arr.some((val: string) => (ISO31661JP.indexOf(val) >= 0)))
    }
    applyDom(elm) {
      const postalcode = elm.querySelectorAll('.p-postal-code');
      new YubinBango.Core(this.reduceVal(postalcode), (address) => this.setAddr(elm, address));
    }
    reduceVal(postalcode: any[]): string {
      return [].map.call(postalcode, a => a.value).reduce((a, b) => a + b);
    }
    setAddr(elm, address) {
      const fnlist = [this.postalFormClear, this.postalFormSet];
      // 住所欄に入力されているデータを削除 & 住所欄に入力
      fnlist.map((fn) => HADRLIST.map((val: string) => fn(val, elm, address)));
    }
    postalFormClear(val: string, elm, data?) {
      if (data){
        const addrs = elm.querySelectorAll('.' + val);
        [].map.call(addrs, (addr) => {
          return addr.value = '';
        });
      }
    }
    postalFormSet(val: string, elm, data?) {
      const o = {
        "p-region-id": data.region_id,
        "p-region": data.region,
        "p-locality": data.locality,
        "p-street-address": data.street,
        "p-extended-address": data.extended
      };
      const addrs = elm.querySelectorAll('.' + val);
      [].map.call(addrs, (addr) => {
        return addr.value += (o[val])? o[val] : '';
      });
    }
  }
}
document.addEventListener('DOMContentLoaded', () => {
  new YubinBango.MicroformatDom();
}, false);
