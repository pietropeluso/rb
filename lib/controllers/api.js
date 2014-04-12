'use strict';

/**
 * Get scenarios
 */
exports.getScenarios = function(req, res) {
  res.json(
    {
      xBound : 5,
      yBound : 3,
      routes : [
        {
          startingX : 1,
          startingY : 1,
          startingDirection : "E",
          instructions : "RFRFRFRF"
        },
        {
          startingX : 3,
          startingY : 2,
          startingDirection : "N",
          instructions : "FRRFLLFFRRFLL"
        },
        {
          startingX : 0,
          startingY : 3,
          startingDirection : "W",
          instructions : "LLFFFLFLFL"
        },
        {
          startingX : 4,
          startingY : 1,
          startingDirection : "E",
          instructions : "FLFFRRLLF"
        },
        {
          startingX : 4,
          startingY : 2,
          startingDirection : "N",
          instructions : "FLFRFRFFFRF"
        }
      ]
    }
  );
};