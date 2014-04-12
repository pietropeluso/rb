'use strict';

angular.module('redbadgerApp')
  .controller('MainCtrl', function ($scope, $http) {

    // $scope.scenario = {};
    var xBound, yBound, routes, instructions, startingPosition, startingDirection, path, route, fallen = [];

    var calculatePath = function (startingPosition, startingDirection, instructions) {

      var path = [
        { x: startingPosition.x,
          y: startingPosition.y,
          direction: startingDirection,
          lost: ''
        }
      ];
      var position, direction, operation;

      for (var j = 0; j < instructions.length; j++) {
        operation = instructions[j];
        direction = path[j].direction;
        position = {x: path[j].x, y: path[j].y};

        if (operation === 'F') {
          if (!getNewPosition(direction, position)) {
            path.push({x: position.x, y: position.y, direction: direction, lost: 'LOST'});
            break;
          }
        }
        else {
          direction = getNewOrientation(direction, operation);
        }

        path.push({x: position.x, y: position.y, direction: direction, lost: ''});
      }
      return path;
    };

    var getNewOrientation = function(oldOrientation, direction) {
      if (oldOrientation === 'N') {
        return newOrientationFromNorth(direction);
      }
      else if (oldOrientation === 'S') {
        return newOrientationFromSouth(direction);
      }
      else if (oldOrientation === 'W') {
        return newOrientationFromWest(direction);
      }
      else {
        return newOrientationFromEast(direction);
      }
    };

    var newOrientationFromNorth = function (dir) {
      return dir === 'R' ? 'E' : 'W';
    };

    var newOrientationFromSouth = function (dir) {
      return dir === 'R' ? 'W' : 'E';
    };

    var newOrientationFromWest = function (dir) {
      return dir === 'R' ? 'N' : 'S';
    };

    var newOrientationFromEast = function (dir) {
      return dir === 'R' ? 'S' : 'N';
    };

    var getNewPosition = function (newOrientation, position) {
      var coordinates = position.x + '' + position.y;

      if (newOrientation === 'N'){
        if (position.y + 1 > yBound) {
          if (fallen.indexOf(coordinates) !== -1) {
            // a previous robot has already fallen from these coordinates
            // we return true without updating the coordinates (it doesn't move)
            return true;
          }
          else {
            // the robot moves 'off' the edges of the grid and leave its "scent"
            // that prohibits future robots from dropping off the world at the same grid point
            fallen.push(coordinates);
            return false;
          }
        }
        else {
          // the robot moves correctly to the next coordinates
          position.y += 1;
          return true;
        }
      }

      else if (newOrientation === 'S') {
        if (position.y - 1 < 0) {
          if (fallen.indexOf(coordinates) !== -1) {
            return true;
          }
          else {
            fallen.push(coordinates);
            return false;
          }
        }
        else {
          position.y -= 1;
          return true;
        }
      }

      else if (newOrientation === 'W'){
        if (position.x - 1 < 0) {
          if (fallen.indexOf(coordinates) !== -1) {
            return true;
          }
          else {
            fallen.push(coordinates);
            return false;
          }
        }
        else {
          position.x -= 1;
          return true;
        }
      }

      else {
        if (position.x + 1 > xBound) {
          if (fallen.indexOf(coordinates) !== -1) {
            return true;
          }
          else {
            fallen.push(coordinates);
            return false;
          }
        }
        else {
          position.x += 1;
          return true;
        }
      }
    };


    $http.get('/api/getScenarios').success(function(scenario) {

      $scope.scenario = scenario;
      $scope.paths = [];
      xBound = $scope.scenario.xBound;
      yBound = $scope.scenario.yBound;
      routes = $scope.scenario.routes;

      for (var i = 0; i < routes.length; i++) {
        instructions = routes[i].instructions;
        startingPosition = {x: routes[i].startingX, y: routes[i].startingY};
        startingDirection = routes[i].startingDirection;
        route = calculatePath(startingPosition, startingDirection, instructions);
        path = {startX: startingPosition.x, startY: startingPosition.y, startDirection: startingDirection, instructions: instructions, route: route};
        $scope.paths.push(path);
      }

    });
  });
