(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _set = function set(object, property, value, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent !== null) { set(parent, property, value, receiver); } } else if ("value" in desc && desc.writable) { desc.value = value; } else { var setter = desc.set; if (setter !== undefined) { setter.call(receiver, value); } } return value; };

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Neeto = Neeto || {};

angular.module('app.frontend', ['ui.router', 'ng-token-auth', 'restangular', 'ipCookie', 'oc.lazyLoad', 'angularLazyImg', 'ngDialog'])
// Configure path to API
.config(function (RestangularProvider, apiControllerProvider) {
  RestangularProvider.setDefaultHeaders({ "Content-Type": "application/json" });

  var url = apiControllerProvider.defaultServerURL();
  RestangularProvider.setBaseUrl(url);

  RestangularProvider.setFullRequestInterceptor(function (element, operation, route, url, headers, params, httpConfig) {
    var token = localStorage.getItem("jwt");
    if (token) {
      headers = _.extend(headers, { Authorization: "Bearer " + localStorage.getItem("jwt") });
    }

    return {
      element: element,
      params: params,
      headers: headers,
      httpConfig: httpConfig
    };
  });
});angular.module('app.frontend').config(function ($stateProvider, $urlRouterProvider, $locationProvider) {

  $stateProvider.state('base', {
    abstract: true
  })

  // Homepage
  .state('home', {
    url: '/',
    parent: 'base',
    views: {
      'content@': {
        templateUrl: 'frontend/home.html',
        controller: 'HomeCtrl'
      }
    }
  })

  // Auth routes
  .state('auth', {
    abstract: true,
    url: '/auth',
    parent: 'base',
    views: {
      'content@': {
        templateUrl: 'frontend/auth/wrapper.html'
      }
    }
  }).state('auth.login', {
    url: '/login',
    templateUrl: 'frontend/auth/login.html'
  }).state('auth.forgot', {
    url: '/forgot',
    templateUrl: 'frontend/auth/forgot.html'
  }).state('auth.reset', {
    url: '/reset?reset_password_token&email',
    templateUrl: 'frontend/auth/reset.html',
    controller: function controller($rootScope, $stateParams) {
      $rootScope.resetData = { reset_password_token: $stateParams.reset_password_token, email: $stateParams.email };

      // Clear reset_password_token on change state
      $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams, options) {
        $rootScope.reset_password_token = null;
      });
    }
  })

  // 404 Error
  .state('404', {
    parent: 'base',
    views: {
      'content@': {
        templateUrl: 'frontend/errors/404.html'
      }
    }
  });

  // Default fall back route
  $urlRouterProvider.otherwise(function ($injector, $location) {
    var state = $injector.get('$state');
    state.go('404');
    return $location.path();
  });

  // enable HTML5 Mode for SEO
  $locationProvider.html5Mode(true);
});
;
var BaseCtrl = function BaseCtrl($rootScope, modelManager) {
  // $rootScope.resetPasswordSubmit = function() {
  //   var new_keys = Neeto.crypto.generateEncryptionKeysForUser($rootScope.resetData.password, $rootScope.resetData.email);
  //   var data = _.clone($rootScope.resetData);
  //   data.password = new_keys.pw;
  //   data.password_confirmation = new_keys.pw;
  //   $auth.updatePassword(data);
  //   apiController.setGk(new_keys.gk);
  // }

  // var note = new Note();
  // note.content = {title: "hello", text: "world"};
  // console.log("note content", note.content);
  // console.log("note title", note.title);
  // console.log("note json", JSON.stringify(note));
  //
  // console.log("Copy", _.cloneDeep(note));

  _classCallCheck(this, BaseCtrl);
};

angular.module('app.frontend').controller('BaseCtrl', BaseCtrl);
;angular.module('app.frontend').directive("editorSection", function ($timeout) {
  return {
    restrict: 'E',
    scope: {
      save: "&",
      remove: "&",
      note: "=",
      user: "="
    },
    templateUrl: 'frontend/editor.html',
    replace: true,
    controller: 'EditorCtrl',
    controllerAs: 'ctrl',
    bindToController: true,

    link: function link(scope, elem, attrs, ctrl) {

      var handler = function handler(event) {
        if (event.ctrlKey || event.metaKey) {
          switch (String.fromCharCode(event.which).toLowerCase()) {
            case 's':
              event.preventDefault();
              $timeout(function () {
                ctrl.saveNote(event);
              });
              break;
            case 'e':
              event.preventDefault();
              $timeout(function () {
                ctrl.clickedEditNote();
              });
              break;
            case 'm':
              event.preventDefault();
              $timeout(function () {
                ctrl.toggleMarkdown();
              });
              break;
            case 'o':
              event.preventDefault();
              $timeout(function () {
                ctrl.toggleFullScreen();
              });
              break;
          }
        }
      };

      window.addEventListener('keydown', handler);

      scope.$on('$destroy', function () {
        window.removeEventListener('keydown', handler);
      });

      scope.$watch('ctrl.note', function (note, oldNote) {
        if (note) {
          ctrl.setNote(note, oldNote);
        } else {
          ctrl.note = {};
        }
      });
    }
  };
}).controller('EditorCtrl', function ($sce, $timeout, apiController, modelManager, markdownRenderer, $rootScope) {

  this.demoNotes = [{ title: "Live print a file with tail", content: "tail -f log/production.log" }, { title: "Create SSH tunnel", content: "ssh -i .ssh/key.pem -N -L 3306:example.com:3306 ec2-user@example.com" }, { title: "List of processes running on port", content: "lsof -i:8080" }, { title: "Set ENV from file", content: "export $(cat .envfile | xargs)" }, { title: "Find process by name", content: "ps -ax | grep <application name>" }, { title: "NPM install without sudo", content: "sudo chown -R $(whoami) ~/.npm" }, { title: "Email validation regex", content: "^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$" }, { title: "Ruby generate 256 bit key", content: "Digest::SHA256.hexdigest(SecureRandom.random_bytes(32))" }, { title: "Mac add user to user tag", content: "sudo dsedittag -o edit -a USERNAME -t user GROUPNAME" }, { title: "Kill Mac OS System Apache", content: "sudo launchctl unload -w /System/Library/LaunchDaemons/org.apache.httpd.plist" }, { title: "Docker run with mount binding and port", content: "docker run -v /home/vagrant/www/app:/var/www/app -p 8080:80 -d kpi/s3" }, { title: "MySQL grant privileges", content: "GRANT [type of permission] ON [database name].[table name] TO ‘[username]’@'%’;" }, { title: "MySQL list users", content: "SELECT User FROM mysql.user;" }];

  this.showSampler = !this.user.uuid && modelManager.filteredNotes.length == 0;

  this.demoNoteNames = _.map(this.demoNotes, function (note) {
    return note.title;
  });

  this.currentDemoContent = { text: null };

  this.prebeginFn = function () {
    this.currentDemoContent.text = null;
  }.bind(this);

  this.callback = function (index) {
    this.currentDemoContent.text = this.demoNotes[index].text;
  }.bind(this);

  this.contentCallback = function (index) {};

  this.setNote = function (note, oldNote) {
    this.editorMode = 'edit';
    if (note.content.text.length == 0) {
      this.focusTitle(100);
    }

    if (oldNote && oldNote != note) {
      if (oldNote.hasChanges) {
        this.save()(oldNote, null);
      } else if (oldNote.dummy) {
        this.remove()(oldNote);
      }
    }
  };

  this.onPreviewDoubleClick = function () {
    this.editorMode = 'edit';
    this.focusEditor(100);
  };

  this.focusEditor = function (delay) {
    setTimeout(function () {
      var element = document.getElementById("note-text-editor");
      element.focus();
    }, delay);
  };

  this.focusTitle = function (delay) {
    setTimeout(function () {
      document.getElementById("note-title-editor").focus();
    }, delay);
  };

  this.clickedTextArea = function () {
    this.showMenu = false;
  };

  this.renderedContent = function () {
    return markdownRenderer.renderHtml(markdownRenderer.renderedContentForText(this.note.content.text));
  };

  var statusTimeout;

  this.saveNote = function ($event) {
    var note = this.note;
    note.dummy = false;
    this.save()(note, function (success) {
      if (success) {
        apiController.clearDraft();

        if (statusTimeout) $timeout.cancel(statusTimeout);
        statusTimeout = $timeout(function () {
          this.noteStatus = "All changes saved";
        }.bind(this), 200);
      }
    }.bind(this));
  };

  this.saveTitle = function ($event) {
    $event.target.blur();
    this.saveNote($event);
    this.focusEditor();
  };

  var saveTimeout;
  this.changesMade = function () {
    this.note.hasChanges = true;
    this.note.dummy = false;
    apiController.saveDraftToDisk(this.note);

    if (saveTimeout) $timeout.cancel(saveTimeout);
    if (statusTimeout) $timeout.cancel(statusTimeout);
    saveTimeout = $timeout(function () {
      this.noteStatus = "Saving...";
      this.saveNote();
    }.bind(this), 150);
  };

  this.contentChanged = function () {
    this.changesMade();
  };

  this.nameChanged = function () {
    this.changesMade();
  };

  this.onNameFocus = function () {
    this.editingName = true;
  };

  this.onContentFocus = function () {
    this.showSampler = false;
    $rootScope.$broadcast("editorFocused");
    this.editingUrl = false;
  };

  this.onNameBlur = function () {
    this.editingName = false;
  };

  this.toggleFullScreen = function () {
    this.fullscreen = !this.fullscreen;
    if (this.fullscreen) {
      if (this.editorMode == 'edit') {
        // refocus
        this.focusEditor(0);
      }
    } else {}
  };

  this.selectedMenuItem = function () {
    this.showMenu = false;
  };

  this.toggleMarkdown = function () {
    if (this.editorMode == 'preview') {
      this.editorMode = 'edit';
    } else {
      this.editorMode = 'preview';
    }
  };

  this.editUrlPressed = function () {
    this.showMenu = false;
    var url = this.publicUrlForNote(this.note);
    url = url.replace(this.note.presentation_name, "");
    this.url = { base: url, token: this.note.presentation_name };
    this.editingUrl = true;
  };

  this.saveUrl = function ($event) {
    $event.target.blur();

    var original = this.note.presentation_name;
    this.note.presentation_name = this.url.token;

    apiController.saveItems([this.note], function (response) {
      if (!response) {
        this.note.presentation_name = original;
        this.url.token = original;
        alert("This URL is not available.");
      } else {
        this.editingUrl = false;
      }
    }.bind(this));
  };

  this.shareNote = function () {

    function openInNewTab(url) {
      var a = document.createElement("a");
      a.target = "_blank";
      a.href = url;
      a.click();
    }

    apiController.shareItem(this.note, function (note) {
      openInNewTab(this.publicUrlForNote(note));
    }.bind(this));
    this.showMenu = false;
  };

  this.unshareNote = function () {
    apiController.unshareItem(this.note, function (note) {});
    this.showMenu = false;
  };

  this.publicUrlForNote = function () {
    return this.note.presentationURL();
  };

  this.clickedMenu = function () {
    if (this.note.locked) {
      alert("This note has been shared without an account, and can therefore not be changed.");
    } else {
      this.showMenu = !this.showMenu;
    }
  };

  this.deleteNote = function () {
    apiController.clearDraft();
    this.remove()(this.note);
    this.showMenu = false;
  };

  this.clickedEditNote = function () {
    this.editorMode = 'edit';
    this.focusEditor(100);
  };
});
;angular.module('app.frontend').directive("header", function () {
  return {
    restrict: 'E',
    scope: {
      user: "=",
      logout: "&"
    },
    templateUrl: 'frontend/header.html',
    replace: true,
    controller: 'HeaderCtrl',
    controllerAs: 'ctrl',
    bindToController: true,

    link: function link(scope, elem, attrs, ctrl) {}
  };
}).controller('HeaderCtrl', function ($auth, $state, apiController, modelManager, serverSideValidation, $timeout) {

  this.changePasswordPressed = function () {
    this.showNewPasswordForm = !this.showNewPasswordForm;
  };

  this.accountMenuPressed = function () {
    this.serverData = { url: apiController.getServer() };
    this.showAccountMenu = !this.showAccountMenu;
    this.showFaq = false;
    this.showNewPasswordForm = false;
  };

  this.changeServer = function () {
    apiController.setServer(this.serverData.url, true);
  };

  this.signOutPressed = function () {
    this.showAccountMenu = false;
    this.logout()();
    apiController.signout();
    window.location.reload();
  };

  this.submitPasswordChange = function () {
    this.passwordChangeData.status = "Generating New Keys...";

    $timeout(function () {
      if (data.password != data.password_confirmation) {
        alert("Your new password does not match its confirmation.");
        return;
      }

      apiController.changePassword(this.user, this.passwordChangeData.current_password, this.passwordChangeData.new_password, function (response) {});
    }.bind(this));
  };

  this.hasLocalData = function () {
    return modelManager.filteredNotes.length > 0;
  };

  this.mergeLocalChanged = function () {
    if (!this.user.shouldMerge) {
      if (!confirm("Unchecking this option means any locally stored tags and notes you have now will be deleted. Are you sure you want to continue?")) {
        this.user.shouldMerge = true;
      }
    }
  };

  this.loginSubmitPressed = function () {
    this.loginData.status = "Generating Login Keys...";
    $timeout(function () {
      apiController.login(this.loginData.email, this.loginData.user_password, function (response) {
        if (response.errors) {
          this.loginData.status = response.errors[0];
        } else {
          this.onAuthSuccess(response.user);
        }
      }.bind(this));
    }.bind(this));
  };

  this.submitRegistrationForm = function () {
    this.loginData.status = "Generating Account Keys...";

    $timeout(function () {
      apiController.register(this.loginData.email, this.loginData.user_password, function (response) {
        if (response.errors) {
          this.loginData.status = response.errors[0];
        } else {
          this.onAuthSuccess(response.user);
        }
      }.bind(this));
    }.bind(this));
  };

  this.forgotPasswordSubmit = function () {
    $auth.requestPasswordReset(this.resetData).then(function (resp) {
      this.resetData.response = "Success";
      // handle success response
    }.bind(this)).catch(function (resp) {
      // handle error response
      this.resetData.response = "Error";
    }.bind(this));
  };

  this.encryptionStatusForNotes = function () {
    var allNotes = modelManager.filteredNotes;
    var countEncrypted = 0;
    allNotes.forEach(function (note) {
      if (note.encryptionEnabled()) {
        countEncrypted++;
      }
    }.bind(this));

    return countEncrypted + "/" + allNotes.length + " notes encrypted";
  };

  this.downloadDataArchive = function () {
    var link = document.createElement('a');
    link.setAttribute('download', 'neeto.json');
    link.href = apiController.notesDataFile(this.user);
    link.click();
  };

  this.importFileSelected = function (files) {
    var file = files[0];
    var reader = new FileReader();
    reader.onload = function (e) {
      apiController.importJSONData(e.target.result, function (success, response) {
        console.log("import response", success, response);
        if (success) {
          // window.location.reload();
        } else {
          alert("There was an error importing your data. Please try again.");
        }
      });
    };
    reader.readAsText(file);
  };

  this.onAuthSuccess = function (user) {
    this.user.uuid = user.uuid;

    if (this.user.shouldMerge && this.hasLocalData()) {
      apiController.mergeLocalDataRemotely(this.user, function () {
        window.location.reload();
      });
    } else {
      window.location.reload();
    }

    this.showLogin = false;
    this.showRegistration = false;
  };
});
;angular.module('app.frontend').controller('HomeCtrl', function ($scope, $rootScope, $timeout, apiController, modelManager) {
  $rootScope.bodyClass = "app-body-class";
  $rootScope.title = "Notes — Neeto, a secure code box for developers";
  $rootScope.description = "A secure code box for developers to store common commands and useful notes.";

  var onUserSet = function onUserSet() {
    apiController.setUser($scope.defaultUser);
    $scope.allTag = new Tag({ all: true });
    $scope.allTag.content.name = "All";
    $scope.tags = modelManager.tags;

    // apiController.verifyEncryptionStatusOfAllItems($scope.defaultUser, function(success){});
  };

  apiController.getCurrentUser(function (response) {
    if (response && !response.errors) {
      console.log("Get user response", response);
      $scope.defaultUser = new User(response);
      modelManager.items = _.map(response.items, function (json_obj) {
        if (json_obj.content_type == "Note") {
          return new Note(json_obj);
        } else if (json_obj.content_type == "Tag") {
          return new Tag(json_obj);
        } else {
          return new Item(json_obj);
        }
      });
      $rootScope.title = "Notes — Neeto";
      onUserSet();
    } else {
      $scope.defaultUser = new User(apiController.localUser());
      onUserSet();
    }
  });

  /*
  Tags Ctrl Callbacks
  */

  $scope.updateAllTag = function () {
    $scope.allTag.notes = modelManager.filteredNotes;
  };

  $scope.tagsWillMakeSelection = function (tag) {
    if (tag.all) {
      $scope.updateAllTag();
    }
  };

  $scope.tagsSelectionMade = function (tag) {
    $scope.selectedTag = tag;
  };

  $scope.tagsAddNew = function (tag) {
    modelManager.addTag(tag);
  };

  $scope.tagsSave = function (tag, callback) {
    apiController.saveItems([tag], callback);
  };

  /*
  Called to update the tag of a note after drag and drop change
  The note object is a copy of the original
  */
  $scope.tagsUpdateNoteTag = function (noteCopy, newTag, oldTag) {

    var originalNote = _.find(modelManager.notes, { uuid: noteCopy.uuid });
    if (!newTag.all) {
      modelManager.addTagToNote(newTag, originalNote);
    }

    apiController.saveDirtyItems(function () {});
  };

  /*
  Notes Ctrl Callbacks
  */

  $scope.notesRemoveTag = function (tag) {
    var validNotes = Note.filterDummyNotes(tag.notes);
    if (validNotes == 0) {
      // if no more notes, delete tag
      apiController.deleteItem($scope.defaultUser, tag, function () {
        // force scope tags to update on sub directives
        $scope.tags = [];
        $timeout(function () {
          $scope.tags = modelManager.tags;
        });
      });
    } else {
      alert("To delete this tag, remove all its notes first.");
    }
  };

  $scope.notesSelectionMade = function (note) {
    $scope.selectedNote = note;
  };

  $scope.notesAddNew = function (note) {
    modelManager.addNote(note);

    if (!$scope.selectedTag.all) {
      modelManager.addTagToNote($scope.selectedTag, note);
      $scope.updateAllTag();
    } else {
      $scope.selectedTag.notes.unshift(note);
    }
  };

  /*
  Shared Callbacks
  */

  $scope.saveNote = function (note, callback) {
    modelManager.addDirtyItems(note);

    apiController.saveDirtyItems(function () {
      modelManager.addNote(note);
      note.hasChanges = false;

      if (callback) {
        callback(true);
      }
    });
  };

  $scope.deleteNote = function (note) {

    modelManager.deleteNote(note);

    if (note == $scope.selectedNote) {
      $scope.selectedNote = null;
    }

    $scope.updateAllTag();

    if (note.dummy) {
      return;
    }

    apiController.deleteItem(note, function (success) {});
    apiController.saveDirtyItems(function () {});
  };

  /*
  Header Ctrl Callbacks
  */

  $scope.headerLogout = function () {
    $scope.defaultUser = apiController.localUser();
    $scope.tags = $scope.defaultUser.tags;
  };
});
;angular.module('app.frontend').directive("notesSection", function () {
  return {
    scope: {
      addNew: "&",
      selectionMade: "&",
      remove: "&",
      tag: "=",
      user: "=",
      removeTag: "&"
    },

    templateUrl: 'frontend/notes.html',
    replace: true,
    controller: 'NotesCtrl',
    controllerAs: 'ctrl',
    bindToController: true,

    link: function link(scope, elem, attrs, ctrl) {
      scope.$watch('ctrl.tag', function (tag, oldTag) {
        if (tag) {
          ctrl.tagDidChange(tag, oldTag);
        }
      });
    }
  };
}).controller('NotesCtrl', function (apiController, $timeout, $rootScope) {

  $rootScope.$on("editorFocused", function () {
    this.showMenu = false;
  }.bind(this));

  var isFirstLoad = true;

  this.tagDidChange = function (tag, oldTag) {
    this.showMenu = false;

    if (this.selectedNote && this.selectedNote.dummy) {
      _.remove(oldTag.notes, this.selectedNote);
    }

    this.noteFilter.text = "";

    tag.notes.forEach(function (note) {
      note.visible = true;
    });
    this.selectFirstNote(false);

    if (isFirstLoad) {
      $timeout(function () {
        var draft = apiController.getDraft();
        if (draft) {
          var note = draft;
          this.selectNote(note);
        } else {
          this.createNewNote();
          isFirstLoad = false;
        }
      }.bind(this));
    } else if (tag.notes.length == 0) {
      this.createNewNote();
    }
  };

  this.selectedTagDelete = function () {
    this.showMenu = false;
    this.removeTag()(this.tag);
  };

  this.selectedTagShare = function () {
    this.showMenu = false;

    if (!this.user.uuid) {
      alert("You must be signed in to share a tag.");
      return;
    }

    if (this.tag.all) {
      alert("You cannot share the 'All' tag.");
      return;
    }

    apiController.shareItem(this.tag, function (response) {});
  };

  this.selectedTagUnshare = function () {
    this.showMenu = false;
    apiController.unshareItem(this.tag, function (response) {});
  };

  this.selectFirstNote = function (createNew) {
    var visibleNotes = this.tag.notes.filter(function (note) {
      return note.visible;
    });

    if (visibleNotes.length > 0) {
      this.selectNote(visibleNotes[0]);
    } else if (createNew) {
      this.createNewNote();
    }
  };

  this.selectNote = function (note) {
    this.selectedNote = note;
    this.selectionMade()(note);
  };

  this.createNewNote = function () {
    var title = "New Note" + (this.tag.notes ? " " + (this.tag.notes.length + 1) : "");
    this.newNote = new Note({ dummy: true });
    this.newNote.content.title = title;
    this.selectNote(this.newNote);
    this.addNew()(this.newNote);
  };

  this.noteFilter = { text: '' };

  this.filterNotes = function (note) {
    if (this.noteFilter.text.length == 0) {
      note.visible = true;
    } else {
      note.visible = note.title.toLowerCase().includes(this.noteFilter.text) || note.text.toLowerCase().includes(this.noteFilter.text);
    }
    return note.visible;
  }.bind(this);

  this.filterTextChanged = function () {
    $timeout(function () {
      if (!this.selectedNote.visible) {
        this.selectFirstNote(false);
      }
    }.bind(this), 100);
  };
});
;angular.module('app.frontend').directive("tagsSection", function () {
  return {
    restrict: 'E',
    scope: {
      addNew: "&",
      selectionMade: "&",
      willSelect: "&",
      save: "&",
      tags: "=",
      allTag: "=",
      user: "=",
      updateNoteTag: "&"
    },
    templateUrl: 'frontend/tags.html',
    replace: true,
    controller: 'TagsCtrl',
    controllerAs: 'ctrl',
    bindToController: true,

    link: function link(scope, elem, attrs, ctrl) {
      scope.$watch('ctrl.tags', function (newTags) {
        if (newTags) {
          ctrl.setTags(newTags);
        }
      });

      scope.$watch('ctrl.allTag', function (allTag) {
        if (allTag) {
          ctrl.setAllTag(allTag);
        }
      });
    }
  };
}).controller('TagsCtrl', function () {

  var initialLoad = true;

  this.setAllTag = function (allTag) {
    this.selectTag(this.allTag);
  };

  this.setTags = function (tags) {
    if (initialLoad) {
      initialLoad = false;
      this.selectTag(this.allTag);
    } else {
      if (tags && tags.length > 0) {
        this.selectTag(tags[0]);
      }
    }
  };

  this.selectTag = function (tag) {
    this.willSelect()(tag);
    this.selectedTag = tag;
    this.selectionMade()(tag);
  };

  this.clickedAddNewTag = function () {
    if (this.editingTag) {
      return;
    }

    this.newTag = new Tag();
    this.selectedTag = this.newTag;
    this.editingTag = this.newTag;
    this.addNew()(this.newTag);
  };

  var originalTagName = "";
  this.onTagTitleFocus = function (tag) {
    originalTagName = tag.content.name;
  };

  this.tagTitleDidChange = function (tag) {
    this.editingTag = tag;
  };

  this.saveTag = function ($event, tag) {
    this.editingTag = null;
    if (tag.content.name.length == 0) {
      tag.content.name = originalTagName;
      originalTagName = "";
      return;
    }

    $event.target.blur();
    if (!tag.content.name || tag.content.name.length == 0) {
      return;
    }

    this.save()(tag, function (savedTag) {
      // _.merge(tag, savedTag);
      this.selectTag(tag);
      this.newTag = null;
    }.bind(this));
  };

  this.noteCount = function (tag) {
    var validNotes = Note.filterDummyNotes(tag.notes);
    return validNotes.length;
  };

  this.handleDrop = function (e, newTag, note) {
    this.updateNoteTag()(note, newTag, this.selectedTag);
  }.bind(this);
});
;angular.module('app.frontend').controller('UsernameModalCtrl', function ($scope, apiController, Restangular, user, callback, $timeout) {
  $scope.formData = {};

  $scope.saveUsername = function () {
    apiController.setUsername(user, $scope.formData.username, function (response) {
      var username = response.root_path;
      user.presentation = response;
      callback(username);
      $scope.closeThisDialog();
    });
  };
});
;
var Item = function () {
  function Item(json_obj) {
    _classCallCheck(this, Item);

    var content;

    Object.defineProperty(this, "content", {
      get: function get() {
        return content;
      },
      set: function set(value) {
        var finalValue = value;

        if (typeof value === 'string') {
          try {
            var decodedValue = JSON.parse(value);
            finalValue = decodedValue;
          } catch (e) {
            finalValue = value;
          }
        }
        content = finalValue;
      },
      enumerable: true
    });

    _.merge(this, json_obj);

    if (!this.uuid) {
      this.uuid = Neeto.crypto.generateUUID();
    }

    this.setContentRaw = function (rawContent) {
      content = rawContent;
    };

    if (!this.content) {
      this.content = {};
    }

    if (!this.content.references) {
      this.content.references = [];
    }
  }

  _createClass(Item, [{
    key: 'addReference',
    value: function addReference(reference) {
      this.content.references.push(reference);
      this.content.references = _.uniq(this.content.references);
      this.updateReferencesLocalMapping();
    }
  }, {
    key: 'removeReference',
    value: function removeReference(reference) {
      _.remove(this.content.references, _.find(this.content.references, { uuid: reference.uuid }));
      this.updateReferencesLocalMapping();
    }
  }, {
    key: 'referencesMatchingContentType',
    value: function referencesMatchingContentType(contentType) {
      return this.content.references.filter(function (reference) {
        return reference.content_type == contentType;
      });
    }
  }, {
    key: 'updateReferencesLocalMapping',
    value: function updateReferencesLocalMapping() {
      // should be overriden to manage local properties
    }
  }, {
    key: 'referencesAffectedBySharingChange',
    value: function referencesAffectedBySharingChange() {
      // should be overriden to determine which references should be decrypted/encrypted
      return null;
    }
  }, {
    key: 'isPublic',
    value: function isPublic() {
      return this.presentation_name;
    }
  }, {
    key: 'isEncrypted',
    value: function isEncrypted() {
      return this.encryptionEnabled() && typeof this.content === 'string' ? true : false;
    }
  }, {
    key: 'encryptionEnabled',
    value: function encryptionEnabled() {
      return this.loc_eek;
    }
  }, {
    key: 'presentationURL',
    value: function presentationURL() {
      return this.presentation_url;
    }
  }]);

  return Item;
}();

;
var Note = function (_Item) {
  _inherits(Note, _Item);

  function Note(json_obj) {
    _classCallCheck(this, Note);

    var _this = _possibleConstructorReturn(this, (Note.__proto__ || Object.getPrototypeOf(Note)).call(this, json_obj));

    if (!_this.tags) {
      _this.tags = [];
    }

    if (!_this.content.title) {
      _this.content.title = "";
      _this.content.text = "";
    }
    return _this;
  }

  _createClass(Note, [{
    key: 'updateReferencesLocalMapping',
    value: function updateReferencesLocalMapping() {
      _get(Note.prototype.__proto__ || Object.getPrototypeOf(Note.prototype), 'updateReferencesLocalMapping', this).call(this);
      this.tags = this.referencesMatchingContentType("Tag");
    }
  }, {
    key: 'referencesAffectedBySharingChange',
    value: function referencesAffectedBySharingChange() {
      return _get(Note.prototype.__proto__ || Object.getPrototypeOf(Note.prototype), 'referencesAffectedBySharingChange', this).call(this);
    }
  }, {
    key: 'toJSON',
    value: function toJSON() {
      return { uuid: this.uuid };
    }
  }, {
    key: 'isPublic',
    value: function isPublic() {
      return _get(Note.prototype.__proto__ || Object.getPrototypeOf(Note.prototype), 'isPublic', this).call(this) || this.hasOnePublicTag;
    }
  }, {
    key: 'hasOnePublicTag',
    get: function get() {
      var hasPublicTag = false;
      this.tags.forEach(function (tag) {
        if (tag.isPublic()) {
          hasPublicTag = true;
          return;
        }
      });

      return hasPublicTag;
    }
  }, {
    key: 'content_type',
    get: function get() {
      return "Note";
    }
  }], [{
    key: 'filterDummyNotes',
    value: function filterDummyNotes(notes) {
      var filtered = notes.filter(function (note) {
        return note.dummy == false || note.dummy == null;
      });
      return filtered;
    }
  }]);

  return Note;
}(Item);

;
var Tag = function (_Item2) {
  _inherits(Tag, _Item2);

  function Tag(json_obj) {
    _classCallCheck(this, Tag);

    var _this2 = _possibleConstructorReturn(this, (Tag.__proto__ || Object.getPrototypeOf(Tag)).call(this, json_obj));

    if (!_this2.notes) {
      _this2.notes = [];
    }

    if (!_this2.content.name) {
      _this2.content.name = "";
    }
    return _this2;
  }

  _createClass(Tag, [{
    key: 'updateReferencesLocalMapping',
    value: function updateReferencesLocalMapping() {
      _get(Tag.prototype.__proto__ || Object.getPrototypeOf(Tag.prototype), 'updateReferencesLocalMapping', this).call(this);
      this.notes = this.referencesMatchingContentType("Note");
    }
  }, {
    key: 'referencesAffectedBySharingChange',
    value: function referencesAffectedBySharingChange() {
      return this.referencesMatchingContentType("Note");
    }
  }, {
    key: 'content_type',
    get: function get() {
      return "Tag";
    }
  }]);

  return Tag;
}(Item);

;
var User = function User(json_obj) {
  _classCallCheck(this, User);

  _.merge(this, json_obj);
};

;angular.module('app.frontend').provider('apiController', function () {

  function domainName() {
    var domain_comps = location.hostname.split(".");
    var domain = domain_comps[domain_comps.length - 2] + "." + domain_comps[domain_comps.length - 1];
    return domain;
  }

  var url;

  this.defaultServerURL = function () {
    if (!url) {
      url = localStorage.getItem("server");
      if (!url) {
        url = location.protocol + "//" + domainName() + (location.port ? ':' + location.port : '');
      }
    }
    return url;
  };

  this.$get = function (Restangular, modelManager, ngDialog) {
    return new ApiController(Restangular, modelManager, ngDialog);
  };

  function ApiController(Restangular, modelManager, ngDialog) {

    this.setUser = function (user) {
      this.user = user;
    };

    /*
    Config
    */

    this.getServer = function () {
      if (!url) {
        url = localStorage.getItem("server");
        if (!url) {
          url = location.protocol + "//" + domainName() + (location.port ? ':' + location.port : '');
          this.setServer(url);
        }
      }
      return url;
    };

    this.setServer = function (url, refresh) {
      localStorage.setItem("server", url);
      if (refresh) {
        window.location.reload();
      }
    };

    /*
    Auth
    */

    this.getCurrentUser = function (callback) {
      if (!localStorage.getItem("jwt")) {
        callback(null);
        return;
      }
      Restangular.one("users/current").get().then(function (response) {
        var plain = response.plain();
        var items = plain.items;
        console.log("retreived items", plain);
        this.decryptItemsWithLocalKey(items);
        callback(plain);
      }.bind(this)).catch(function (error) {
        callback(null);
      });
    };

    this.login = function (email, password, callback) {
      var keys = Neeto.crypto.generateEncryptionKeysForUser(password, email);
      this.setGk(keys.gk);
      var request = Restangular.one("auth/sign_in.json");
      request.user = { password: keys.pw, email: email };
      request.post().then(function (response) {
        localStorage.setItem("jwt", response.token);
        callback(response);
      });
    };

    this.register = function (email, password, callback) {
      var keys = Neeto.crypto.generateEncryptionKeysForUser(password, email);
      this.setGk(keys.gk);
      var request = Restangular.one("auth.json");
      request.user = { password: keys.pw, email: email };
      request.post().then(function (response) {
        localStorage.setItem("jwt", response.token);
        callback(response);
      });
    };

    this.changePassword = function (user, current_password, new_password) {
      var current_keys = Neeto.crypto.generateEncryptionKeysForUser(current_password, user.email);
      var new_keys = Neeto.crypto.generateEncryptionKeysForUser(new_password, user.email);

      var data = {};
      data.current_password = current_keys.pw;
      data.password = new_keys.pw;
      data.password_confirmation = new_keys.pw;

      var user = this.user;

      this._performPasswordChange(current_keys, new_keys, function (response) {
        if (response && !response.errors) {
          // this.showNewPasswordForm = false;
          // reencrypt data with new gk
          this.reencryptAllItemsAndSave(user, new_keys.gk, current_keys.gk, function (success) {
            if (success) {
              this.setGk(new_keys.gk);
              alert("Your password has been changed and your data re-encrypted.");
            } else {
              // rollback password
              this._performPasswordChange(new_keys, current_keys, function (response) {
                alert("There was an error changing your password. Your password has been rolled back.");
                window.location.reload();
              });
            }
          }.bind(this));
        } else {
          // this.showNewPasswordForm = false;
          alert("There was an error changing your password. Please try again.");
        }
      });
    };

    this._performPasswordChange = function (email, current_keys, new_keys, callback) {
      var request = Restangular.one("auth");
      request.user = { password: new_keys.pw, password_confirmation: new_keys.pw, current_password: current_keys.pw, email: email };
      request.patch().then(function (response) {
        callback(response);
      });
    };

    /*
    User
    */

    this.setUsername = function (user, username, callback) {
      var request = Restangular.one("users", user.uuid);
      request.username = username;
      request.patch().then(function (response) {
        callback(response.plain());
      });
    };

    /*
    Ensures that if encryption is disabled, all local items are uncrypted,
    and that if it's enabled, that all local items are encrypted
    */
    this.verifyEncryptionStatusOfAllItems = function (user, callback) {
      var allItems = user.filteredItems();
      var itemsNeedingUpdate = [];
      allItems.forEach(function (item) {
        if (!item.isPublic()) {
          if (item.encryptionEnabled() && !item.isEncrypted()) {
            itemsNeedingUpdate.push(item);
          }
        } else {
          if (item.isEncrypted()) {
            itemsNeedingUpdate.push(item);
          }
        }
      }.bind(this));

      if (itemsNeedingUpdate.length > 0) {
        console.log("verifying encryption, items need updating", itemsNeedingUpdate);
        this.saveBatchItems(user, itemsNeedingUpdate, callback);
      }
    };

    /*
    Items
    */

    this.saveDirtyItems = function (callback) {
      var dirtyItems = modelManager.dirtyItems;
      if (dirtyItems.length == 0) {
        callback();
        return;
      }

      this.saveItems(dirtyItems, function (response) {
        modelManager.clearDirtyItems();
        callback();
      });
    };

    this.saveItems = function (items, callback) {
      console.log("saving items", items);
      var request = Restangular.one("users", this.user.uuid).one("items");
      request.items = _.map(items, function (item) {
        return this.createRequestParamsForItem(item);
      }.bind(this));
      console.log("sending request items", request.items);

      request.post().then(function (response) {
        var savedItems = response.items;
        console.log("response items", savedItems);
        callback(response);
      });
    };

    this.createRequestParamsForItem = function (item) {
      var itemCopy = _.cloneDeep(item);

      var params = { uuid: item.uuid, content_type: item.content_type, presentation_name: item.presentation_name };

      itemCopy.content.references = _.map(itemCopy.content.references, function (reference) {
        return { uuid: reference.uuid, content_type: reference.content_type };
      });

      if (!item.isPublic()) {
        // encrypted
        this.encryptSingleItem(itemCopy, this.retrieveGk());
        params.content = itemCopy.content;
        params.loc_eek = itemCopy.loc_eek;
      } else {
        // decrypted
        params.content = JSON.stringify(item.content);
        params.loc_eek = null;
      }
      return params;
    };

    this.deleteItem = function (item, callback) {
      if (!this.user.uuid) {
        this.writeUserToLocalStorage(this.user);
        callback(true);
      } else {
        Restangular.one("users", this.user.uuid).one("items", item.uuid).remove().then(function (response) {
          callback(true);
        });
      }
    };

    this.shareItem = function (item, callback) {
      console.log("sharing item", item);
      if (!this.user.uuid) {
        alert("You must be signed in to share.");
        return;
      }

      var shareFn = function () {
        item.presentation_name = "_auto_";
        var needsUpdate = [item].concat(item.referencesAffectedBySharingChange() || []);
        this.saveItems(needsUpdate, function (success) {});
      }.bind(this);

      if (!this.user.username) {
        ngDialog.open({
          template: 'frontend/modals/username.html',
          controller: 'UsernameModalCtrl',
          resolve: {
            user: function () {
              return this.user;
            }.bind(this),
            callback: function callback() {
              return shareFn;
            }
          },
          className: 'ngdialog-theme-default',
          disableAnimation: true
        });
      } else {
        shareFn();
      }
    };

    this.unshareItem = function (item, callback) {
      console.log("unsharing item", item);
      item.presentation_name = null;
      var needsUpdate = [item].concat(item.referencesAffectedBySharingChange() || []);
      this.saveItems(needsUpdate, function (success) {});
    };

    /*
    Import
    */

    this.importJSONData = function (jsonString, callback) {
      var data = JSON.parse(jsonString);
      var user = new User(data);
      console.log("importing data", JSON.parse(jsonString));
      user.items.forEach(function (item) {
        if (item.isPublic()) {
          item.setContentRaw(JSON.stringify(item.content));
        } else {
          this.encryptSingleItemWithLocalKey(item);
        }

        // prevent circular links
        item.tag = null;
      }.bind(this));

      user.tags.forEach(function (tag) {
        // prevent circular links
        tag.items = null;
      });

      var request = Restangular.one("import");
      request.data = { items: user.items, tags: user.tags };
      request.post().then(function (response) {
        callback(true, response);
      }).catch(function (error) {
        callback(false, error);
      });
    };

    /*
    Export
    */

    this.itemsDataFile = function (user) {
      var textFile = null;
      var makeTextFile = function (text) {
        var data = new Blob([text], { type: 'text/json' });

        // If we are replacing a previously generated file we need to
        // manually revoke the object URL to avoid memory leaks.
        if (textFile !== null) {
          window.URL.revokeObjectURL(textFile);
        }

        textFile = window.URL.createObjectURL(data);

        // returns a URL you can use as a href
        return textFile;
      }.bind(this);

      var presentationParams = function presentationParams(presentation) {
        if (!presentation) {
          return null;
        }

        return {
          id: presentation.uuid,
          uuid: presentation.uuid,
          root_path: presentation.root_path,
          relative_path: presentation.relative_path,
          presentable_type: presentation.presentable_type,
          presentable_id: presentation.presentable_id,
          created_at: presentation.created_at,
          modified_at: presentation.modified_at
        };
      };

      var items = _.map(user.filteredItems(), function (item) {
        return {
          id: item.uuid,
          uuid: item.uuid,
          content: item.content,
          tag_id: item.tag_id,
          created_at: item.created_at,
          modified_at: item.modified_at,
          presentation: presentationParams(item.presentation)
        };
      });

      var tags = _.map(user.tags, function (tag) {
        return {
          id: tag.uuid,
          uuid: tag.uuid,
          name: tag.name,
          created_at: tag.created_at,
          modified_at: tag.modified_at,
          presentation: presentationParams(tag.presentation)
        };
      });

      var data = {
        items: items,
        tags: tags
      };

      return makeTextFile(JSON.stringify(data, null, 2 /* pretty print */));
    };

    /*
    Merging
    */
    this.mergeLocalDataRemotely = function (user, callback) {
      var request = Restangular.one("users", user.uuid).one("merge");
      var tags = user.tags;
      request.items = user.items;
      request.items.forEach(function (item) {
        if (item.tag_id) {
          var tag = tags.filter(function (tag) {
            return tag.uuid == item.tag_id;
          })[0];
          item.tag_name = tag.name;
        }
      });
      request.post().then(function (response) {
        callback();
        localStorage.removeItem('user');
      });
    };

    this.staticifyObject = function (object) {
      return JSON.parse(JSON.stringify(object));
    };

    this.writeUserToLocalStorage = function (user) {
      var saveUser = _.cloneDeep(user);
      saveUser.items = Item.filterDummyItems(saveUser.items);
      saveUser.tags.forEach(function (tag) {
        tag.items = null;
      }.bind(this));
      this.writeToLocalStorage('user', saveUser);
    };

    this.writeToLocalStorage = function (key, value) {
      localStorage.setItem(key, angular.toJson(value));
    };

    this.localUser = function () {
      var user = JSON.parse(localStorage.getItem('user'));
      if (!user) {
        user = { items: [], tags: [] };
      }
      user.shouldMerge = true;
      return user;
    };

    /*
    Drafts
    */

    this.saveDraftToDisk = function (draft) {
      // localStorage.setItem("draft", JSON.stringify(draft));
    };

    this.clearDraft = function () {
      localStorage.removeItem("draft");
    };

    this.getDraft = function () {
      var draftString = localStorage.getItem("draft");
      if (!draftString || draftString == 'undefined') {
        return null;
      }
      return new Item(JSON.parse(draftString));
    };

    /*
    Encrpytion
    */

    this.retrieveGk = function () {
      if (!this.gk) {
        this.gk = localStorage.getItem("gk");
      }
      return this.gk;
    };

    this.setGk = function (gk) {
      localStorage.setItem('gk', gk);
    };

    this.signout = function () {
      localStorage.removeItem("jwt");
      localStorage.removeItem("gk");
    };

    this.encryptSingleItem = function (item, key) {
      var ek = null;
      if (item.loc_eek) {
        ek = Neeto.crypto.decryptText(item.loc_eek, key);
      } else {
        ek = Neeto.crypto.generateRandomEncryptionKey();
        item.loc_eek = Neeto.crypto.encryptText(ek, key);
      }
      item.content = Neeto.crypto.encryptText(JSON.stringify(item.content), ek);
      item.local_encryption_scheme = "1.0";
    };

    this.encryptItems = function (items, key) {
      items.forEach(function (item) {
        this.encryptSingleItem(item, key);
      }.bind(this));
    };

    this.encryptSingleItemWithLocalKey = function (item) {
      this.encryptSingleItem(item, this.retrieveGk());
    };

    this.encryptItemsWithLocalKey = function (items) {
      this.encryptItems(items, this.retrieveGk());
    };

    this.encryptNonPublicItemsWithLocalKey = function (items) {
      var nonpublic = items.filter(function (item) {
        return !item.isPublic() && !item.pending_share;
      });
      this.encryptItems(nonpublic, this.retrieveGk());
    };

    this.decryptSingleItemWithLocalKey = function (item) {
      this.decryptSingleItem(item, this.retrieveGk());
    };

    this.decryptSingleItem = function (item, key) {
      var ek = Neeto.crypto.decryptText(item.loc_eek || item.local_eek, key);
      var content = Neeto.crypto.decryptText(item.content, ek);
      //  console.log("decrypted contnet", content);
      item.content = content;
    };

    this.decryptItems = function (items, key) {
      items.forEach(function (item) {
        //  console.log("is encrypted?", item);
        if (item.loc_eek && typeof item.content === 'string') {
          this.decryptSingleItem(item, key);
        }
      }.bind(this));
    };

    this.decryptItemsWithLocalKey = function (items) {
      this.decryptItems(items, this.retrieveGk());
    };

    this.reencryptAllItemsAndSave = function (user, newKey, oldKey, callback) {
      var items = user.filteredItems();
      items.forEach(function (item) {
        if (item.loc_eek && typeof item.content === 'string') {
          // first decrypt eek with old key
          var ek = Neeto.crypto.decryptText(item.loc_eek, oldKey);
          // now encrypt ek with new key
          item.loc_eek = Neeto.crypto.encryptText(ek, newKey);
        }
      });

      this.saveBatchItems(user, items, function (success) {
        callback(success);
      }.bind(this));
    };
  }
});
;
var ItemManager = function () {
  function ItemManager() {
    _classCallCheck(this, ItemManager);
  }

  _createClass(ItemManager, [{
    key: 'referencesForItemId',
    value: function referencesForItemId(itemId) {
      return _.find(this.items, { uuid: itemId });
    }
  }, {
    key: 'resolveReferences',
    value: function resolveReferences() {
      this.items.forEach(function (item) {
        // build out references
        item.content.references = _.map(item.content.references, function (reference) {
          return this.referencesForItemId(reference.uuid);
        }.bind(this));
      }.bind(this));
    }
  }, {
    key: 'itemsForContentType',
    value: function itemsForContentType(contentType) {
      return this.items.filter(function (item) {
        return item.content_type == contentType;
      });
    }

    // returns dirty item references that need saving

  }, {
    key: 'deleteItem',
    value: function deleteItem(item) {
      var dirty = [];
      _.remove(this.items, item);
      var length = item.content.references.length;
      // note that references are deleted in this for loop, so you have to be careful how you iterate
      for (var i = 0; i < length; i++) {
        var referencedItem = item.content.references[0];
        // console.log("removing references between items", referencedItem, item);
        var _dirty = this.removeReferencesBetweenItems(referencedItem, item);
        dirty = dirty.concat(_dirty);
      }

      return dirty;
    }
  }, {
    key: 'removeReferencesBetweenItems',
    value: function removeReferencesBetweenItems(itemOne, itemTwo) {
      itemOne.removeReference(itemTwo);
      itemTwo.removeReference(itemOne);
      return [itemOne, itemTwo];
    }
  }, {
    key: 'createReferencesBetweenItems',
    value: function createReferencesBetweenItems(itemOne, itemTwo) {
      itemOne.addReference(itemTwo);
      itemTwo.addReference(itemOne);
      return [itemOne, itemTwo];
    }
  }, {
    key: 'items',
    set: function set(items) {
      this._items = items;
      this.resolveReferences();
    },
    get: function get() {
      return this._items;
    }
  }]);

  return ItemManager;
}();

angular.module('app.frontend').service('itemManager', ItemManager);
;angular.module('app.frontend').service('markdownRenderer', function ($sce) {

  marked.setOptions({
    breaks: true,
    sanitize: true
  });

  this.renderedContentForText = function (text) {
    if (!text || text.length == 0) {
      return "";
    }
    return marked(text);
  };

  this.renderHtml = function (html_code) {
    return $sce.trustAsHtml(html_code);
  };
});
;
var ModelManager = function (_ItemManager) {
  _inherits(ModelManager, _ItemManager);

  function ModelManager() {
    _classCallCheck(this, ModelManager);

    var _this3 = _possibleConstructorReturn(this, (ModelManager.__proto__ || Object.getPrototypeOf(ModelManager)).call(this));

    _this3.notes = [];
    _this3.groups = [];
    _this3.dirtyItems = [];
    return _this3;
  }

  _createClass(ModelManager, [{
    key: 'addDirtyItems',
    value: function addDirtyItems(items) {
      if (!(items instanceof Array)) {
        items = [items];
      }

      this.dirtyItems = this.dirtyItems.concat(items);
      this.dirtyItems = _.uniq(this.dirtyItems);
    }
  }, {
    key: 'clearDirtyItems',
    value: function clearDirtyItems() {
      this.dirtyItems = [];
    }
  }, {
    key: 'addNote',
    value: function addNote(note) {
      if (!_.find(this.notes, { uuid: note.uuid })) {
        this.notes.unshift(note);
      }
    }
  }, {
    key: 'addTag',
    value: function addTag(tag) {
      this.tags.unshift(tag);
    }
  }, {
    key: 'addTagToNote',
    value: function addTagToNote(tag, note) {
      var dirty = this.createReferencesBetweenItems(tag, note);
      this.refreshRelationshipsForTag(tag);
      this.refreshRelationshipsForNote(note);
      this.addDirtyItems(dirty);
    }
  }, {
    key: 'refreshRelationshipsForTag',
    value: function refreshRelationshipsForTag(tag) {
      tag.notes = tag.referencesMatchingContentType("Note");
      tag.notes.sort(function (a, b) {
        return new Date(b.created_at) - new Date(a.created_at);
      });
    }
  }, {
    key: 'refreshRelationshipsForNote',
    value: function refreshRelationshipsForNote(note) {
      note.tags = note.referencesMatchingContentType("Tag");
    }
  }, {
    key: 'removeTagFromNote',
    value: function removeTagFromNote(tag, note) {
      var dirty = this.removeReferencesBetweenItems(tag, note);
      this.addDirtyItems(dirty);
    }
  }, {
    key: 'deleteNote',
    value: function deleteNote(note) {
      var dirty = this.deleteItem(note);
      _.remove(this.notes, note);
      this.addDirtyItems(dirty);
    }
  }, {
    key: 'deleteTag',
    value: function deleteTag(tag) {
      var dirty = this.deleteItem(tag);
      _.remove(this.tags, tag);
      this.addDirtyItems(dirty);
    }
  }, {
    key: 'filteredNotes',
    value: function filteredNotes() {
      return Note.filterDummyNotes(this.notes);
    }
  }, {
    key: 'items',
    set: function set(items) {
      _set(ModelManager.prototype.__proto__ || Object.getPrototypeOf(ModelManager.prototype), 'items', items, this);
      this.notes = this.itemsForContentType("Note");
      this.notes.forEach(function (note) {
        note.updateReferencesLocalMapping();
      });

      this.tags = this.itemsForContentType("Tag");
      this.tags.forEach(function (tag) {
        tag.updateReferencesLocalMapping();
      });
    },
    get: function get() {
      return _get(ModelManager.prototype.__proto__ || Object.getPrototypeOf(ModelManager.prototype), 'items', this);
    }
  }, {
    key: 'filteredNotes',
    get: function get() {
      return Note.filterDummyNotes(this.notes);
    }
  }]);

  return ModelManager;
}(ItemManager);

angular.module('app.frontend').service('modelManager', ModelManager);
;angular.module('app.frontend').service('serverSideValidation', function ($sce) {
  // Show validation errors in form.
  this.showErrors = function (formErrors, form) {
    angular.forEach(formErrors, function (errors, key) {
      if (typeof form[key] !== 'undefined') {
        form[key].$setDirty();
        form[key].$setValidity('server', false);
        form[key].$error.server = $sce.trustAsHtml(errors.join(', '));
      }
    });
  };

  // Get validation errors from server response and show them in form.
  this.parseErrors = function (response, form) {
    if (response.status === 422) {
      this.showErrors(response.data, form);
    }
  };
});
;angular.module('app.frontend').directive('mbAutofocus', ['$timeout', function ($timeout) {
  return {
    restrict: 'A',
    scope: {
      shouldFocus: "="
    },
    link: function link($scope, $element) {
      $timeout(function () {
        if ($scope.shouldFocus) {
          $element[0].focus();
        }
      });
    }
  };
}]);
;angular.module('app.frontend').directive('draggable', function () {
  return {
    scope: {
      note: "="
    },
    link: function link(scope, element) {
      // this gives us the native JS object
      var el = element[0];

      el.draggable = true;

      el.addEventListener('dragstart', function (e) {
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('Note', JSON.stringify(scope.note));
        this.classList.add('drag');
        return false;
      }, false);

      el.addEventListener('dragend', function (e) {
        this.classList.remove('drag');
        return false;
      }, false);
    }
  };
});

angular.module('app.frontend').directive('droppable', function () {
  return {
    scope: {
      drop: '&',
      bin: '=',
      tag: "="
    },
    link: function link(scope, element) {
      // again we need the native object
      var el = element[0];

      el.addEventListener('dragover', function (e) {
        e.dataTransfer.dropEffect = 'move';
        // allows us to drop
        if (e.preventDefault) e.preventDefault();
        this.classList.add('over');
        return false;
      }, false);

      var counter = 0;

      el.addEventListener('dragenter', function (e) {
        counter++;
        this.classList.add('over');
        return false;
      }, false);

      el.addEventListener('dragleave', function (e) {
        counter--;
        if (counter === 0) {
          this.classList.remove('over');
        }
        return false;
      }, false);

      el.addEventListener('drop', function (e) {
        // Stops some browsers from redirecting.
        if (e.stopPropagation) e.stopPropagation();

        this.classList.remove('over');

        var binId = this.uuid;
        var note = new Note(JSON.parse(e.dataTransfer.getData('Note')));
        scope.$apply(function (scope) {
          var fn = scope.drop();
          if ('undefined' !== typeof fn) {
            fn(e, scope.tag, note);
          }
        });

        return false;
      }, false);
    }
  };
});
;angular.module('app.frontend').directive('fileChange', function () {
  return {
    restrict: 'A',
    scope: {
      handler: '&'
    },
    link: function link(scope, element) {
      element.on('change', function (event) {
        scope.$apply(function () {
          scope.handler({ files: event.target.files });
        });
      });
    }
  };
});
;angular.module('app.frontend').directive('lowercase', function () {
  return {
    require: 'ngModel',
    link: function link(scope, element, attrs, modelCtrl) {
      var lowercase = function lowercase(inputValue) {
        if (inputValue == undefined) inputValue = '';
        var lowercased = inputValue.toLowerCase();
        if (lowercased !== inputValue) {
          modelCtrl.$setViewValue(lowercased);
          modelCtrl.$render();
        }
        return lowercased;
      };
      modelCtrl.$parsers.push(lowercase);
      lowercase(scope[attrs.ngModel]);
    }
  };
});
;angular.module('app.frontend').directive('selectOnClick', ['$window', function ($window) {
  return {
    restrict: 'A',
    link: function link(scope, element, attrs) {
      element.on('focus', function () {
        if (!$window.getSelection().toString()) {
          // Required for mobile Safari
          this.setSelectionRange(0, this.value.length);
        }
      });
    }
  };
}]);
;angular.module('app.frontend').directive('note', function ($timeout) {
  return {
    restrict: 'E',
    controller: 'SingleNoteCtrl',
    templateUrl: "frontend/directives/note.html",
    scope: {
      note: "="
    }
  };
}).controller('SingleNoteCtrl', function ($rootScope, $scope, $state, markdownRenderer) {
  $scope.renderedContent = function () {
    return markdownRenderer.renderHtml(markdownRenderer.renderedContentForText($scope.note.text));
  };
});
; /**
  * AngularJS directive that simulates the effect of typing on a text editor - with a blinking cursor.
  * This directive works as an attribute to any HTML element, and it changes the speed/delay of its animation.
  *
  * There's also a simple less file included for basic styling of the dialog, which can be overridden.
  * The config object also lets the user define custom CSS classes for the modal.
  *
  *  How to use:
  *
  *  Just add the desired text to the 'text' attribute of the element and the directive takes care of the rest.
  *  The 'text' attribute can be a single string or an array of string. In case an array is passed, the string
  *  on each index is erased so the next item can be printed. When the last index is reached, that string stays
  *  on the screen. (So if you want to erase the last string, just push an empty string to the end of the array)
  *
  * These are the optional preferences:
  *  - initial delay: set an 'initial-delay' attribute for the element
  *  - type delay: set a 'type-delay' attribute for the element
  *  - erase delay: set a 'erase-delay' attribute for the element
  *  - specify cursor : set a 'cursor' attribute for the element, specifying which cursor to use
  *  - turn off cursor blinking: set the 'blink-cursor' attribute  to "false"
  *  - cursor blinking speed: set a 'blink-delay' attribute for the element
  *  - scope callback: pass the desired scope callback as the 'callback-fn' attribute of the element
  *
  * Note:
  * Each time/delay value should be set either on seconds (1s) or milliseconds (1000)
  *
  * Dependencies:
  * The directive needs the css file provided in order to replicate the cursor blinking effect.
  */

angular.module('app.frontend').directive('typewrite', ['$timeout', function ($timeout) {
  function linkFunction($scope, $element, $attrs) {
    var timer = null,
        initialDelay = $attrs.initialDelay ? getTypeDelay($attrs.initialDelay) : 200,
        typeDelay = $attrs.typeDelay || 200,
        eraseDelay = $attrs.eraseDelay || typeDelay / 2,
        blinkDelay = $attrs.blinkDelay ? getAnimationDelay($attrs.blinkDelay) : false,
        cursor = $attrs.cursor || '|',
        blinkCursor = typeof $attrs.blinkCursor !== 'undefined' ? $attrs.blinkCursor === 'true' : true,
        currentText,
        textArray,
        running,
        auxStyle;

    if ($scope.text) {
      if ($scope.text instanceof Array) {
        textArray = $scope.text;
        currentText = textArray[0];
      } else {
        currentText = $scope.text;
      }
    }
    if (typeof $scope.start === 'undefined' || $scope.start) {
      typewrite();
    }

    function typewrite() {
      timer = $timeout(function () {
        updateIt($element, 0, 0, currentText);
      }, initialDelay);
    }

    function updateIt(element, charIndex, arrIndex, text) {
      if (charIndex <= text.length) {
        updateValue(element, text.substring(0, charIndex) + cursor);
        charIndex++;
        timer = $timeout(function () {
          updateIt(element, charIndex, arrIndex, text);
        }, typeDelay);
        return;
      } else {
        charIndex--;

        if ($scope.iterationCallback) {
          $scope.iterationCallback()(arrIndex);
        }

        // check if it's an array
        if (textArray && arrIndex < textArray.length - 1) {
          timer = $timeout(function () {
            cleanAndRestart(element, charIndex, arrIndex, textArray[arrIndex]);
          }, $scope.iterationDelay);
        } else {
          if ($scope.callbackFn) {
            $scope.callbackFn();
          }
          blinkIt(element, charIndex, currentText);
        }
      }
    }

    function blinkIt(element, charIndex) {
      var text = element.text().substring(0, element.text().length - 1);
      if (blinkCursor) {
        if (blinkDelay) {
          auxStyle = '-webkit-animation:blink-it steps(1) ' + blinkDelay + ' infinite;-moz-animation:blink-it steps(1) ' + blinkDelay + ' infinite ' + '-ms-animation:blink-it steps(1) ' + blinkDelay + ' infinite;-o-animation:blink-it steps(1) ' + blinkDelay + ' infinite; ' + 'animation:blink-it steps(1) ' + blinkDelay + ' infinite;';
          updateValue(element, text.substring(0, charIndex) + '<span class="blink" style="' + auxStyle + '">' + cursor + '</span>');
        } else {
          updateValue(element, text.substring(0, charIndex) + '<span class="blink">' + cursor + '</span>');
        }
      } else {
        updateValue(element, text.substring(0, charIndex));
      }
    }

    function cleanAndRestart(element, charIndex, arrIndex, currentText) {
      if (charIndex == 0) {
        if ($scope.prebeginFn) {
          $scope.prebeginFn()();
        }
      }
      if (charIndex > 0) {
        currentText = currentText.slice(0, -1);
        // element.html(currentText.substring(0, currentText.length - 1) + cursor);
        updateValue(element, currentText + cursor);
        charIndex--;
        timer = $timeout(function () {
          cleanAndRestart(element, charIndex, arrIndex, currentText);
        }, eraseDelay);
        return;
      } else {
        arrIndex++;
        currentText = textArray[arrIndex];
        timer = $timeout(function () {
          updateIt(element, 0, arrIndex, currentText);
        }, typeDelay);
      }
    }

    function getTypeDelay(delay) {
      if (typeof delay === 'string') {
        return delay.charAt(delay.length - 1) === 's' ? parseInt(delay.substring(0, delay.length - 1), 10) * 1000 : +delay;
      } else {
        return false;
      }
    }

    function getAnimationDelay(delay) {
      if (typeof delay === 'string') {
        return delay.charAt(delay.length - 1) === 's' ? delay : parseInt(delay.substring(0, delay.length - 1), 10) / 1000;
      }
    }

    function updateValue(element, value) {
      if (element.prop('nodeName').toUpperCase() === 'INPUT') {
        return element.val(value);
      }
      return element.html(value);
    }

    $scope.$on('$destroy', function () {
      if (timer) {
        $timeout.cancel(timer);
      }
    });

    $scope.$watch('start', function (newVal) {
      if (!running && newVal) {
        running = !running;
        typewrite();
      }
    });

    $scope.$watch('text', function (newVal, oldVal) {
      if (!(newVal instanceof Array)) {
        currentText = newVal;
        typewrite();
      }
    });
  }

  return {
    restrict: 'A',
    link: linkFunction,
    replace: true,
    scope: {
      text: '=',
      callbackFn: '&',
      iterationCallback: '&',
      iterationDelay: '=',
      prebeginFn: '&',
      start: '='
    }
  };
}]);
;var Neeto = Neeto || {};

Neeto.crypto = {

  generateRandomKey: function generateRandomKey() {
    return CryptoJS.lib.WordArray.random(256 / 8).toString();
  },

  generateUUID: function generateUUID() {
    var d = new Date().getTime();
    if (window.performance && typeof window.performance.now === "function") {
      d += performance.now(); //use high-precision timer if available
    }
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c == 'x' ? r : r & 0x3 | 0x8).toString(16);
    });
    return uuid;
  },

  decryptText: function decryptText(encrypted_content, key) {
    return CryptoJS.AES.decrypt(encrypted_content, key).toString(CryptoJS.enc.Utf8);
  },

  encryptText: function encryptText(text, key) {
    return CryptoJS.AES.encrypt(text, key).toString();
  },

  generateRandomEncryptionKey: function generateRandomEncryptionKey() {
    var salt = Neeto.crypto.generateRandomKey();
    var passphrase = Neeto.crypto.generateRandomKey();
    return CryptoJS.PBKDF2(passphrase, salt, { keySize: 256 / 32 }).toString();
  },

  sha256: function sha256(text) {
    return CryptoJS.SHA256(text).toString();
  },

  /** Generates two deterministic 256 bit keys based on one input */
  generateAsymmetricKeyPair: function generateAsymmetricKeyPair(input, salt) {
    var output = CryptoJS.PBKDF2(input, salt, { keySize: 512 / 32, hasher: CryptoJS.algo.SHA512, iterations: 3000 });
    var firstHalf = _.clone(output);
    var secondHalf = _.clone(output);
    var sigBytes = output.sigBytes / 2;
    var outputLength = output.words.length;
    firstHalf.words = output.words.slice(0, outputLength / 2);
    secondHalf.words = output.words.slice(outputLength / 2, outputLength);
    firstHalf.sigBytes = sigBytes;
    secondHalf.sigBytes = sigBytes;
    return [firstHalf.toString(), secondHalf.toString()];
  },

  generateEncryptionKeysForUser: function generateEncryptionKeysForUser(password, email) {
    var keys = Neeto.crypto.generateAsymmetricKeyPair(password, email);
    var pw = keys[0];
    var gk = keys[1];

    return { pw: pw, gk: gk };
  }
};


},{}]},{},[1]);