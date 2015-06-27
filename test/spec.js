browser.ignoreSynchronization = true;
browser.get(browser.baseUrl+'/test/htdocs/yubinbango.html');

describe('YubinBango', function() {
  describe('郵便番号を3桁-4桁形式で入力される場合', function() {
    it('住所欄をワンボックスにする場合', function() {
      expect( element.all(by.css('#a1 .p-postal-code')).count() ).toEqual( 2 );
      element.all(by.css('#a1 .p-postal-code')).get(0).sendKeys(100)
      .then(function(){
        element.all(by.css('#a1 .p-postal-code')).get(1).sendKeys(8950)
        .then(function(){
          browser.driver.sleep(1000)
          .then(function(){
            expect(element(by.css('#a1 .p-region')).getAttribute('value')).toEqual('東京都千代田区霞が関１丁目２－１');
          });
        });
      });
    });

    it('都道府県 と 以降の住所 に分ける場合', function() {
      expect( element.all(by.css('#a2 .p-postal-code')).count() ).toEqual( 2 );
      element.all(by.css('#a2 .p-postal-code')).get(0).sendKeys(100)
      .then(function(){
        element.all(by.css('#a2 .p-postal-code')).get(1).sendKeys(8950)
        .then(function(){
          browser.driver.sleep(1000)
          .then(function(){
            expect(element(by.css('#a2 .p-region')).getAttribute('value')).toEqual('東京都');
            expect(element(by.css('#a2 .p-locality')).getAttribute('value')).toEqual('千代田区霞が関１丁目２－１');
          });
        });
      });
    });

    it('都道府県 と 市町村区 と 以降の住所に分ける場合', function() {
      expect( element.all(by.css('#a3 .p-postal-code')).count() ).toEqual( 2 );
      element.all(by.css('#a3 .p-postal-code')).get(0).sendKeys(100)
      .then(function(){
        element.all(by.css('#a3 .p-postal-code')).get(1).sendKeys(8950)
        .then(function(){
          browser.driver.sleep(1000)
          .then(function(){
            expect(element(by.css('#a3 .p-region')).getAttribute('value')).toEqual('東京都');
            expect(element(by.css('#a3 .p-locality')).getAttribute('value')).toEqual('千代田区');
            expect(element(by.css('#a3 .p-street-address')).getAttribute('value')).toEqual('霞が関１丁目２－１');
          });
        });
      });
    });

    it('都道府県 と 市町村区 と 町域 と 以降の住所に分ける場合', function() {
      expect( element.all(by.css('#a4 .p-postal-code')).count() ).toEqual( 2 );
      element.all(by.css('#a4 .p-postal-code')).get(0).sendKeys(100)
      .then(function(){
        element.all(by.css('#a4 .p-postal-code')).get(1).sendKeys(8950)
        .then(function(){
          browser.driver.sleep(1000)
          .then(function(){
            expect(element(by.css('#a4 .p-region')).getAttribute('value')).toEqual('東京都');
            expect(element(by.css('#a4 .p-locality')).getAttribute('value')).toEqual('千代田区');
            expect(element(by.css('#a4 .p-street-address')).getAttribute('value')).toEqual('霞が関');
            expect(element(by.css('#a4 .p-extended-address')).getAttribute('value')).toEqual('１丁目２－１');
          });
        });
      });
    });

  });

  describe('ワンボックスで郵便番号7桁を入力させる場合', function() {
    it('住所欄をワンボックスにする場合', function() {
      expect( element.all(by.css('#b1 .p-postal-code')).count() ).toEqual( 1 );
      element.all(by.css('#b1 .p-postal-code')).get(0).sendKeys(1008950)
      .then(function(){
        browser.driver.sleep(1000)
        .then(function(){
          expect(element(by.css('#b1 .p-region')).getAttribute('value')).toEqual('東京都千代田区霞が関１丁目２－１');
        });
      });
    });

    it('都道府県 と 以降の住所 に分ける場合', function() {
      expect( element.all(by.css('#b2 .p-postal-code')).count() ).toEqual( 1 );
      element.all(by.css('#b2 .p-postal-code')).get(0).sendKeys(1008950)
      .then(function(){
        browser.driver.sleep(1000)
        .then(function(){
          expect(element(by.css('#b2 .p-region')).getAttribute('value')).toEqual('東京都');
          expect(element(by.css('#b2 .p-locality')).getAttribute('value')).toEqual('千代田区霞が関１丁目２－１');
        });
      });
    });

    it('都道府県 と 市町村区 と 以降の住所に分ける場合', function() {
      expect( element.all(by.css('#b3 .p-postal-code')).count() ).toEqual( 1 );
      element.all(by.css('#b3 .p-postal-code')).get(0).sendKeys(1008950)
      .then(function(){
        browser.driver.sleep(1000)
        .then(function(){
          expect(element(by.css('#b3 .p-region')).getAttribute('value')).toEqual('東京都');
          expect(element(by.css('#b3 .p-locality')).getAttribute('value')).toEqual('千代田区');
          expect(element(by.css('#b3 .p-street-address')).getAttribute('value')).toEqual('霞が関１丁目２－１');
        });
      });
    });

    it('都道府県 と 市町村区 と 町域 と 以降の住所に分ける場合', function() {
      expect( element.all(by.css('#b4 .p-postal-code')).count() ).toEqual( 1 );
      element.all(by.css('#b4 .p-postal-code')).get(0).sendKeys(1008950)
      .then(function(){
        browser.driver.sleep(1000)
        .then(function(){
          expect(element(by.css('#b4 .p-region')).getAttribute('value')).toEqual('東京都');
          expect(element(by.css('#b4 .p-locality')).getAttribute('value')).toEqual('千代田区');
          expect(element(by.css('#b4 .p-street-address')).getAttribute('value')).toEqual('霞が関');
          expect(element(by.css('#b4 .p-extended-address')).getAttribute('value')).toEqual('１丁目２－１');
        });
      });
    });

  });

  it('inputタグが深い階層にある場合', function() {
    expect( element.all(by.css('#c1 .p-postal-code')).count() ).toEqual( 2 );
    element.all(by.css('#c1 .p-postal-code')).get(0).sendKeys(100)
    .then(function(){
      element.all(by.css('#c1 .p-postal-code')).get(1).sendKeys(8950)
      .then(function(){
        browser.driver.sleep(1000)
        .then(function(){
          expect(element(by.css('#c1 .p-region')).getAttribute('value')).toEqual('東京都千代田区霞が関１丁目２－１');
        });
      });
    });
  });

});
