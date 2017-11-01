angular.module('serverApp',["ngTable"])
.service('ProviderServices', providerService)
.controller('ProvidersController', providerController);

function providerService($http) {
   
  this.get = function(url) {
    return $http.get(url);
   }

   this.put = function(url, params) {
    return $http.put(url, params);
   }

   this.post = function(url, params) {
    return $http.post(url, params);
   }

   this.delete = function(url, id) {
    return $http.delete(url+id);
   }
}

function providerController(ProviderServices, NgTableParams){
  var self = this;
  self.formData = {};
  self.docID = "";

  self.openModalForm = function(){
    self.isSubmit = true;
    self.isUpdate = false;
    self.modalTitle = "Add provider";
    $('#myModal').modal('show');
  }

  self.getProviders = function(){
    ProviderServices.get('http://localhost:3000/providers')
    .then(function(response) {
      self.tableParams = new NgTableParams({}, { dataset: response.data});
    });
  }

  self.getProviderID = function(id){
    ProviderServices.get('http://localhost:3000/providers/'+id)
        .then(function(response){
          self.formData = response.data[0];
          self.docID = self.formData._id
          self.isSubmit = false;
          self.isUpdate = true;
          self.modalTitle = "Update provider";
          $('#myModal').modal('show');
        });
}

  self.addProvider = function(){
    ProviderServices.post('http://localhost:3000/providers', self.formData)
    .then(function (response) {
      if(response.statusText=='Created'){
        $('#myModal').modal('toggle');
        self.formData = {};
        self.getProviders();
      }
    });
  }

  self.updateProvider = function(){
    ProviderServices.put('http://localhost:3000/providers/'+self.docID, self.formData)
    .then(function (response) {
      if(response.statusText=='Accepted'){
        $('#myModal').modal('toggle');
        self.formData = {};
        self.getProviders();
      }
    });
  }

  self.deleteProvider = function(id){
    var confirmation = confirm("Are you sure?");
    if(confirmation){
      ProviderServices.delete('http://localhost:3000/providers/', id)
          .then(function(response){
            if(response.statusText == 'No Content'){
              self.getProviders();
            }
          });
    }
  }

  self.getProviders();
}

