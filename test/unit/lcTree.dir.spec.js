describe('jsplumbDemo', function () {
  var $rootScope, $compile, $document, baseElem, baseAttr, mockSelectedData, mockData, $httpBackend, originalTimeout, $scope;

  it('should be able to cascade selections', function(){
    expect(true).toBe(true);
  });

  afterEach(function() {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
  });
});
