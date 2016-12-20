(function () {
'use strict';
angular.module('NarrowItDownApp', [])
.controller('NarrowItDownController', NarrowItDownController)
.service ('MenuSearchService', MenuSearchService)
.constant('ApiBasePath', "https://davids-restaurant.herokuapp.com/menu_items.json")
.directive ('foundItems', foundItems)
;

// Define Main Controller
  NarrowItDownController.$inject = ['MenuSearchService'];
  function NarrowItDownController(MenuSearchService) {
    var controller = this;
    var querystat = -1;
    var found = [];
    controller.SearchString = "<Enter your search criteria>";
    controller.remItem = function(index) {
      console.log ("Remove item in Controller");
      console.log ("invoked with index="+index);
      console.log ("Found.length()="+controller.found.length);
      controller.found.splice(index, 1);
    }

    controller.sayHello = function() {
      console.log ("I am in the Hello World! of controller !")
      alert ("Hello World!");
    }

    controller.Search = function() {
      console.log ("Search function in NarrowItDownController invoked");
       controller.querystat = -1;
      var promise = MenuSearchService.getMatchedMenuItems(controller.SearchString);
       promise.then(
            function (foundItems) {
            console.log ("In promise...then of main controller");
            controller.found = foundItems;
            if (controller.found.length > 0) {
              controller.querystat = 1;
            } else {
              controller.querystat = 0;
            }
            console.log ("Filling controller with (" +  controller.found.length + ") items");
          }
       )
    }
  }

// Define Service
   MenuSearchService.$inject = ['$http','ApiBasePath'];
  function MenuSearchService($http,ApiBasePath) {
    var service = this;
    service.getMatchedMenuItems = function (searchTerm) {
      //Method responsible for reaching out to the server
      console.log("HTTP Service is now going invoked");
      var promise = $http ({
          method: "GET",url: (ApiBasePath)
        });
      return promise.then(function (response) {
            console.log ("HTTP responded. Searching for " + searchTerm) ;
            // process result and only keep items that match
            console.log ("Number of items: " +  response.data.menu_items.length);
            var foundItems = [];
            for (var i = 0; i < response.data.menu_items.length; i++) {
              var s= response.data.menu_items[i];
              //console.log ("Item num." + i + " Name: " + s.name);
              if (s.name.search(searchTerm) > -1 ) {
              //    console.log ("Category match!");
                  foundItems.push (s);
              }
            }
          // return processed items
            return foundItems;
        })
        .catch(function (error) {
          console.log("Something went terribly wrong.");
        })

    }
  }
  // Define the Directive's controller
function foundItemsDirectiveController() {
  var DirectiveController = this;
}

// Define the directive
function  foundItems () {
  var ddo = {
    templateUrl: 'founditems.html',
    scope: {
      found: '<',
      onremove: '&',
      say: '&'
        },
     controller: foundItemsDirectiveController,
     controllerAs: 'l',
     bindToController: true
  };
  return ddo;
}
})();
