const ISO31661JP = ["Japan", "JP", "JPN", "JAPAN"];
const HADRLIST = [
  "p-region-id",
  "p-region",
  "p-locality",
  "p-street-address",
  "p-extended-address"
];
let CACHE = [];
module YubinBango {
  export class MicroformatDom {
    constructor() {
      this.hadrloop();
    }
    hadrloop() {
      // HTML内のh-adr要素のリストに対して操作を行う
      const hadrs = document.querySelectorAll(".h-adr");
      [].map.call(hadrs, hadr => {
        // country-name が日本かどうかチェック
        if (this.countryNameCheck(hadr)) {
          // 郵便番号の入力欄を取得
          const postalcode = hadr.querySelectorAll(".p-postal-code");
          // 郵便番号入力欄が1つの場合でも3桁-4桁で2つに分かれている場合でも両方に対応するため、それぞれのh-adr内の中の最後のpostal-codeにchangeイベントを付与する
          postalcode[postalcode.length - 1].addEventListener(
            "change",
            e => {
              MicroformatDom.prototype.applyDom(
                this.getFormNode(e.target.parentNode)
              );
            },
            false
          );
        }
      });
    }
    getFormNode(elm) {
      return elm.tagName !== "FORM" && !elm.classList.contains("h-adr")
        ? this.getFormNode(elm.parentNode)
        : elm;
    }
    // 日本かどうかチェックする
    countryNameCheck(elm) {
      const a = elm.querySelector(".p-country-name");
      const arr: string[] = [a.innerHTML, a.value];
      return arr.some((val: string) => ISO31661JP.indexOf(val) >= 0);
    }
    applyDom(elm) {
      const postalcode = elm.querySelectorAll(".p-postal-code");
      new YubinBango.Core(this.reduceVal(postalcode), address =>
        this.setAddr(elm, address)
      );
    }
    reduceVal(postalcode: any[]): string {
      return [].map.call(postalcode, a => a.value).reduce((a, b) => a + b);
    }
    setAddr(elm, address) {
      const fnlist = [this.postalFormClear, this.postalFormSet];
      // 住所欄に入力されているデータを削除 & 住所欄に入力
      fnlist.map(fn => HADRLIST.map((val: string) => fn(val, elm, address)));
    }
    postalFormClear(val: string, elm, data?) {
      if (data) {
        const addrs = elm.querySelectorAll("." + val);
        [].map.call(addrs, addr => {
          return (addr.value = "");
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
      const addrs = elm.querySelectorAll("." + val);
      [].map.call(addrs, addr => {
        return (addr.value += o[val] ? o[val] : "");
      });
    }
  }

  export class Core {
    URL =
      "https://pepup-assets.s3-ap-northeast-1.amazonaws.com/lib/yubinbango-data/data";
    REGION: string[] = [
      null,
      "北海道",
      "青森県",
      "岩手県",
      "宮城県",
      "秋田県",
      "山形県",
      "福島県",
      "茨城県",
      "栃木県",
      "群馬県",
      "埼玉県",
      "千葉県",
      "東京都",
      "神奈川県",
      "新潟県",
      "富山県",
      "石川県",
      "福井県",
      "山梨県",
      "長野県",
      "岐阜県",
      "静岡県",
      "愛知県",
      "三重県",
      "滋賀県",
      "京都府",
      "大阪府",
      "兵庫県",
      "奈良県",
      "和歌山県",
      "鳥取県",
      "島根県",
      "岡山県",
      "広島県",
      "山口県",
      "徳島県",
      "香川県",
      "愛媛県",
      "高知県",
      "福岡県",
      "佐賀県",
      "長崎県",
      "熊本県",
      "大分県",
      "宮崎県",
      "鹿児島県",
      "沖縄県"
    ];
    constructor(inputVal: string = "", callback?) {
      if (inputVal) {
        // 全角の数字を半角に変換 ハイフンが入っていても数字のみの抽出
        const a: string = inputVal.replace(/[０-９]/g, (s: string) =>
          String.fromCharCode(s.charCodeAt(0) - 65248)
        );
        const b: RegExpMatchArray = a.match(/\d/g);
        const c: string = b.join("");
        const yubin7: string = this.chk7(c);
        // 7桁の数字の時のみ作動
        if (yubin7) {
          this.getAddr(yubin7, callback);
        } else {
          callback(this.addrDic());
        }
      }
    }
    chk7(val: string) {
      if (val.length === 7) {
        return val;
      }
    }
    addrDic(
      region_id = "",
      region = "",
      locality = "",
      street = "",
      extended = ""
    ): { [key: string]: string } {
      return {
        region_id: region_id,
        region: region,
        locality: locality,
        street: street,
        extended: extended
      };
    }
    selectAddr(addr: string[]): { [key: string]: string } {
      if (addr && addr[0] && addr[1]) {
        return this.addrDic(
          addr[0],
          this.REGION[addr[0]],
          addr[1],
          addr[2],
          addr[3]
        );
      } else {
        return this.addrDic();
      }
    }
    jsonp(url: string, fn) {
      window["$yubin"] = data => fn(data);
      const scriptTag = document.createElement("script");
      scriptTag.setAttribute("type", "text/javascript");
      scriptTag.setAttribute("charset", "UTF-8");
      scriptTag.setAttribute("src", url);
      document.head.appendChild(scriptTag);
    }
    getAddr(yubin7: string, fn): { [key: string]: string } {
      const yubin3 = yubin7.substr(0, 3);
      // 郵便番号上位3桁でキャッシュデータを確認
      if (yubin3 in CACHE && yubin7 in CACHE[yubin3]) {
        return fn(this.selectAddr(CACHE[yubin3][yubin7]));
      } else {
        this.jsonp(`${this.URL}/${yubin3}.js`, data => {
          CACHE[yubin3] = data;
          return fn(this.selectAddr(data[yubin7]));
        });
      }
    }
  }
}
document.addEventListener(
  "DOMContentLoaded",
  () => {
    new YubinBango.MicroformatDom();
  },
  false
);
