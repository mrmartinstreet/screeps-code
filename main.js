  module.exports.loop = function() {



      /*if (!Memory.time) {
          Memory.time = 0;
      }
      Memory.time = Memory.time + 1;
      if (Memory.time != Game.time) {
          if (_.filter(Game.rooms, room => room)[0].controller.progress == 0) {
              delete Memory.creeps;
              delete Memory.rooms;
              delete Memory.roomsData;
              //delete mo.baseSpawn;
              //delete mo.baseSources;
              //delete mo.baseMinerals;
          }
          Memory.time = Game.time;
      }*/


      //Game.creeps["spawnFiller32739272"].memory.homeRoom = "E29N4";
      //Game.spawns["Spawn1"].spawnCreep([CARRY, CARRY, MOVE, MOVE], "spawnFiller" + Game.time);

      if (!Memory.creeps) {
          Memory.creeps = {};
      }

      for (let mem in Memory.creeps) {
          if (!Game.creeps[mem]) {
              delete Memory.creeps[mem];
          }
      }

      let creepsCount = 0;
      for (let cr in Memory.creeps) {
          creepsCount++;
      }
      for (let ro in Game.rooms) {

          //Memory.rooms[ro].spawnList = [];

          if (!Memory.rooms) {
              Memory.rooms = {};
          }

          if (!Memory.rooms[ro]) {
              Memory.rooms[ro] = {};
          }

          if (!Memory.rooms[ro].sources) {
              Memory.rooms[ro].sources = [];
              baseSources = Game.rooms[ro].find(FIND_SOURCES);
              for (let bs in baseSources) {
                  Memory.rooms[ro].sources.push(baseSources[bs].id);
              }
          }

          if (!Memory.rooms[ro].sourceSelect) {
              Memory.rooms[ro].sourceSelect = 0;
          }

          if (!Memory.rooms[ro].spawnList) {
              Memory.rooms[ro].spawnList = [];
          }

          if (!Memory.rooms[ro].hasSpawn) {
              Memory.rooms[ro].hasSpawn = _.filter(Game.spawns, spawn => spawn.room.name == ro).length > 0;
          }

          let spawns = _.filter(Game.spawns, spawn => spawn.room.name == ro);
          for (let spawn in spawns) {
              var sp = spawns[spawn];

              const LEVEL0 = 0;
              const LEVEL1 = 300;
              const LEVEL2 = 550;
              const LEVEL3 = 800
              const LEVEL4 = 1300;
              const LEVEL5 = 1800;
              const LEVEL6 = 2300;
              const LEVEL7 = 5000;
              const LEVEL8 = 12000;

              const NONE = 0;

              const getEnergyStatus = function(name) { //-----------------------------------------------------------------------------GET ENERGY STATUS-----------------------------------------
                  if (Game.creeps[name].store.getUsedCapacity(RESOURCE_ENERGY) == NONE) {
                      Memory.creeps[name]["energyStatus"] = "Empty";
                  }
                  if (Game.creeps[name].store.getFreeCapacity(RESOURCE_ENERGY) == NONE) {
                      Memory.creeps[name]["energyStatus"] = "Full";

                  }
              }

              const getSourceId = function(sr, name) { //----------------------------------------------------------------------------GET SOURCE ID----------------------------------------------
                  if (Game.creeps[name].room.name != Memory.creeps[name].homeRoom) {
                      Game.creeps[name].moveTo(new RoomPosition(25, 25, Memory.creeps[name].homeRoom));
                  }
                  if (Memory.creeps[name].homeRoom == "E31N4") {
                      return ["59f1a4f882100e1594f3dd32", "source"];
                  }
                  let resources = Game.rooms[Memory.creeps[name].homeRoom].find(FIND_DROPPED_RESOURCES);
                  resources.sort((a, b) => b.amount - a.amount);
                  if (sr == "source") {
                      if (Memory.rooms[ro].sources.length == 1) {
                          return [Memory.rooms[Memory.creeps[name].homeRoom].sources[0], "source"];
                      } else {
                          if (name.match(/^miner/)) {
                              if (Memory.rooms[Memory.creeps[name].homeRoom].sourceSelect == 0) {
                                  Memory.rooms[Memory.creeps[name].homeRoom].sourceSelect = 1;
                              } else {
                                  Memory.rooms[Memory.creeps[name].homeRoom].sourceSelect = 0;
                              }
                          }
                          return [Memory.rooms[Memory.creeps[name].homeRoom].sources[Memory.rooms[ro].sourceSelect], "source"];
                      }
                  } else if (sr == "resource") {

                      if (resources.length == NONE) {
                          return getSourceId("source", name);
                      } else {
                          return [resources[0].id, "resource"];
                      }
                  }
              }

              const getRoomEnergyLevel = function(name = ro) { //---------------------------------------------------------------------------GET ROOM ENERGY LEVEL---------------------------------------
                  if (Game.rooms[ro].energyCapacityAvailable >= LEVEL8) {
                      return LEVEL8;
                  } else if (Game.rooms[name].energyCapacityAvailable >= LEVEL7) {
                      return LEVEL7;
                  } else if (Game.rooms[name].energyCapacityAvailable >= LEVEL6) {
                      return LEVEL6;
                  } else if (Game.rooms[name].energyCapacityAvailable >= LEVEL5) {
                      return LEVEL5;
                  } else if (Game.rooms[name].energyCapacityAvailable >= LEVEL4) {
                      return LEVEL4;
                  } else if (Game.rooms[name].energyCapacityAvailable >= LEVEL3) {
                      return LEVEL3;
                  } else if (Game.rooms[name].energyCapacityAvailable >= LEVEL2) {
                      return LEVEL2;
                  } else if (Game.rooms[name].energyCapacityAvailable >= LEVEL1) {
                      return LEVEL1;
                  } else {
                      return LEVEL1;
                  }
              }
              const creepOrder = function() { //-----------------------------------------------------------------------------------CREEP PRIORITY ORDER-----------------------------------------
                  let order;

                  switch (getRoomEnergyLevel()) {
                      case LEVEL1:
                          order = [
                              [/^miner/, Memory.rooms[ro].sources.length, "miner"],
                              [/^spawnFiller/, 1, "spawnFiller"],
                              [/^builder/, Memory.rooms[ro].sources.length * 1, "builder"],
                              [/^controllerFiller/, 1, "controllerFiller"]
                          ];
                          break;
                      case LEVEL2:
                          order = [
                              [/^miner/, Memory.rooms[ro].sources.length, "miner"],
                              [/^spawnFiller/, 1, "spawnFiller"],
                              [/^builder/, Memory.rooms[ro].sources.length + 1, "builder"],
                              [/^controllerFiller/, 1, "controllerFiller"]
                          ];
                          break;
                      case LEVEL3:
                          order = [
                              [/^miner/, Memory.rooms[ro].sources.length, "miner"],
                              [/^spawnFiller/, 2, "spawnFiller"],
                              [/^builder/, Memory.rooms[ro].sources.length + 1, "builder"],
                              [/^controllerFiller/, 1, "controllerFiller"]
                          ];
                          break;
                      case LEVEL4:
                          order = [
                              [/^miner/, Memory.rooms[ro].sources.length, "miner"],
                              [/^spawnFiller/, 2, "spawnFiller"],
                              [/^builder/, Memory.rooms[ro].sources.length, "builder"],
                              [/^controllerFiller/, 1, "controllerFiller"]
                          ]; //, [/^spy/, 1, "spy"]];
                          break;
                      case LEVEL5:
                          order = [
                              [/^miner/, Memory.rooms[ro].sources.length, "miner"],
                              [/^spawnFiller/, Memory.rooms[ro].sources.length + 2, "spawnFiller"],
                              [/^builder/, 1, "builder"],
                              [/^controllerFiller/, 1, "controllerFiller"],
                              [/^transferer/, 1, "transferer"]
                          ];
                          break;
                      case LEVEL6:
                          order = [
                              [/^miner/, Memory.rooms[ro].sources.length, "miner"],
                              [/^spawnFiller/, Memory.rooms[ro].sources.length + 2, "spawnFiller"],
                              [/^builder/, 1, "builder"],
                              [/^controllerFiller/, 1, "controllerFiller"],
                              [/^transferer/, 1, "transferer"]
                          ];
                          break;
                      case LEVEL7:
                          order = [
                              [/^miner/, Memory.rooms[ro].sources.length, "miner"],
                              [/^spawnFiller/, Memory.rooms[ro].sources.length + 2, "spawnFiller"],
                              [/^builder/, 1, "builder"],
                              [/^controllerFiller/, 1, "controllerFiller"],
                              [/^transferer/, 1, "transferer"]
                          ];
                          break;
                      case LEVEL8:
                          order = [
                              [/^miner/, Memory.rooms[ro].sources.length, "miner"],
                              [/^spawnFiller/, Memory.rooms[ro].sources.length + 2, "spawnFiller"],
                              [/^builder/, 1, "builder"],
                              [/^controllerFiller/, 1, "controllerFiller"],
                              [/^transferer/, 1, "transferer"]
                          ];
                          break;
                  }
                  for (let o in order) {
                      if (_.filter(Object.keys(Memory.creeps), creep => Memory.creeps[creep].homeRoom == ro && creep.match(order[o][0])).length < order[o][1]) {
                          switch (order[o][2]) {
                              case "miner":
                                  spawnMiner(getRoomEnergyLevel());
                                  break;
                              case "spawnFiller":
                                  spawnSpawnFiller(getRoomEnergyLevel());
                                  break;
                              case "builder":
                                  spawnBuilder(getRoomEnergyLevel());
                                  break;
                              case "controllerFiller":
                                  spawnControllerFiller(getRoomEnergyLevel());
                                  break;
                              case "spy":
                                  spawnSpy();
                                  break;
                              case "transferer":
                                  spawnTransferer();
                          }
                          break;
                      }
                  }
              }

              spawnList = { //---------------------------------------------------------------------------------------------------SPAWN LIST (OBJECT)---------------------------------------------
                  add: function(addArray) {
                      if (Memory.rooms[ro].spawnList.length < 1) {
                          Memory.rooms[ro].spawnList.push(addArray);
                      }
                  },

                  hasCreep: function() {
                      return Memory.rooms[ro].spawnList.length > 0;
                  },

                  generate: function() {
                      if (spawnList.hasCreep() && !sp.spawning && sp.room.name == ro) {
                          let newCreep = Memory.rooms[ro].spawnList.shift();
                          Memory.creeps[newCreep[1]] = {};
                          Memory.creeps[newCreep[1]].homeRoom = ro;
                          sp.spawnCreep(newCreep[0], newCreep[1]);
                      }
                  }
              }

              const spawnMiner = function(energyLevel) { //-----------------------------------------------------------------------SPAWN MINER---------------------------------------------------
                  const bodySelector = function(energyLevel) {
                      switch (energyLevel) {
                          case LEVEL1:
                              return [WORK, MOVE, WORK, MOVE];
                          case LEVEL2:
                              return [WORK, WORK, MOVE, WORK, MOVE, WORK, MOVE];
                          case LEVEL3:
                              return [WORK, WORK, MOVE, WORK, MOVE, WORK, MOVE];
                          case LEVEL4:
                              return [WORK, MOVE, WORK, MOVE, WORK, MOVE, WORK, MOVE, WORK, WORK];
                          case LEVEL5:
                              return [WORK, MOVE, WORK, MOVE, WORK, MOVE, WORK, MOVE, WORK, WORK];
                          case LEVEL6:
                              return [WORK, MOVE, WORK, MOVE, WORK, MOVE, WORK, MOVE, WORK, WORK];
                          case LEVEL7:
                              return [WORK, MOVE, WORK, MOVE, WORK, MOVE, WORK, MOVE, WORK, WORK];
                          case LEVEL8:
                              return [WORK, MOVE, WORK, MOVE, WORK, MOVE, WORK, MOVE, WORK, WORK];

                      }
                  }
                  if (sp.room.name == ro) {
                      console.log(bodySelector(energyLevel));
                      spawnList.add([bodySelector(energyLevel), "miner" + Game.time]);
                  }
              }

              const spawnSpawnFiller = function(energyLevel) { //-------------------------------------------------------------SPAWN SPAWNFILLER------------------------------------------------
                  const bodySelector = function(energyLevel) {
                      switch (energyLevel) {
                          case LEVEL1:
                              return [CARRY, MOVE, CARRY, MOVE, CARRY, MOVE];
                          case LEVEL2:
                              return [CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE];
                          case LEVEL3:
                              return [CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE];
                          case LEVEL4:
                              return [CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE];
                          case LEVEL5:
                              return [CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE];
                          case LEVEL6:
                              return [CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE];
                          case LEVEL7:
                              return [CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE];
                          case LEVEL8:
                              return [CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE];

                      }
                  }
                  if (sp.room.name == ro) {
                      spawnList.add([bodySelector(energyLevel), "spawnFiller" + Game.time]);
                  }
              }

              const spawnBuilder = function(energyLevel) { //-------------------------------------------------------------------SPAWN BUILDER-------------------------------------------------
                  const bodySelector = function(energyLevel) {
                      switch (energyLevel) {
                          case LEVEL1:
                              return [WORK, MOVE, CARRY, CARRY, MOVE];
                          case LEVEL2:
                              return [WORK, MOVE, WORK, MOVE, CARRY, MOVE, CARRY, CARRY, MOVE];
                          case LEVEL3:
                              return [WORK, MOVE, WORK, MOVE, WORK, MOVE, WORK, MOVE, CARRY, MOVE, CARRY, MOVE];
                              //case LEVEL4: return [WORK, MOVE, WORK, MOVE, WORK, MOVE, WORK, MOVE, WORK, MOVE, CARRY, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE];
                          case LEVEL4:
                              return [WORK, MOVE, WORK, MOVE, WORK, MOVE, WORK, MOVE, WORK, MOVE, CARRY, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE];
                          case LEVEL5:
                              return [WORK, MOVE, WORK, MOVE, WORK, MOVE, WORK, MOVE, WORK, MOVE, CARRY, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE];
                          case LEVEL6:
                              return [WORK, MOVE, WORK, MOVE, WORK, MOVE, WORK, MOVE, WORK, MOVE, CARRY, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE];
                          case LEVEL7:
                              return [WORK, MOVE, WORK, MOVE, WORK, MOVE, WORK, MOVE, WORK, MOVE, CARRY, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE];
                          case LEVEL8:
                              return [WORK, MOVE, WORK, MOVE, WORK, MOVE, WORK, MOVE, WORK, MOVE, CARRY, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE];

                      }
                  }
                  if (sp.room.name == ro) {
                      spawnList.add([bodySelector(energyLevel), "builder" + Game.time]);
                  }
              }

              const spawnControllerFiller = function(energyLevel) { //-------------------------------------------------------SPAWN CONTROLLER FILLER------------------------------------------

                  const bodySelector = function(energyLevel) {
                      switch (energyLevel) {
                          case LEVEL1:
                              return [WORK, MOVE, CARRY, CARRY, MOVE];
                          case LEVEL2:
                              return [WORK, MOVE, WORK, MOVE, CARRY, MOVE, CARRY, CARRY, MOVE];
                          case LEVEL3:
                              return [WORK, MOVE, WORK, MOVE, WORK, MOVE, WORK, MOVE, CARRY, MOVE, CARRY, MOVE];
                          case LEVEL4:
                              return [WORK, MOVE, WORK, MOVE, WORK, MOVE, WORK, MOVE, WORK, MOVE, CARRY, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE];
                          case LEVEL5:
                              return [WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE];
                          case LEVEL6:
                              return [WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE];
                          case LEVEL7:
                              return [WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE];
                          case LEVEL8:
                              return [WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE];

                      }
                  }
                  if (sp.room.name == ro) {
                      spawnList.add([bodySelector(energyLevel), "controllerFiller" + Game.time]);
                  }
              }

              const spawnSpy = function() { //-------------------------------------------------------------------------------------SPAWN SPY-------------------------------------------------
                  if (sp.room.name == ro) {
                      spawnList.add([
                          [MOVE], "spy" + Game.time
                      ]);
                  }
              }

              const spawnClaimer = function() {
                  spawnList.add([
                      [CLAIM, MOVE, CLAIM, MOVE], "claimer" + Game.time
                  ]);
                  return "claimer" + Game.time;
              }

              const spawnTransferer = function() {
                  if (sp.room.name == ro) {
                      spawnList.add([
                          [CARRY, MOVE, CARRY, MOVE], "transferer" + Game.time
                      ]);
                  }
              }

              const spawnColonist = function() {
                  if (sp.room.name == ro) {
                      spawnList.add([
                          [CLAIM, MOVE, WORK, MOVE, WORK, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, CARRY, MOVE], "colonist" + Game.time
                      ]);
                  }
              }

              const spawnColonist2 = function() {
                  if (sp.room.name == ro) {
                      spawnList.add([
                          [WORK, MOVE, WORK, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE], "colonist" + Game.time
                      ]);
                  }
              }

              const spawnCashCow = function() {
                  if (sp.room.name == ro) {
                      spawnList.add([
                          [WORK, MOVE, WORK, MOVE, WORK, MOVE, WORK, MOVE, WORK, MOVE, WORK, MOVE, WORK, MOVE, WORK, MOVE, WORK, MOVE, WORK, MOVE,
                              CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE
                          ], "cashCow" + Game.time
                      ]);
                  }
              }

              const extensionFieldAnchorPoint = function(name = ro) { //------------------------------------------EXTENSION FIELD ANCHOR POINT--------------------------------------
                  let tMap = Game.map.getRoomTerrain(name);
                  let width = 0;
                  let height = 0;
                  let tArrayY = new Array(50);
                  let tArrayX;
                  for (let h = 0; h < 50; h++) {
                      let twelve = 0;
                      tArrayX = new Array(50);
                      for (let w = 0; w < 50; w++) {
                          let cell = tMap.get(w, h);
                          if (cell == 1) {
                              tArrayX[w] = 0;
                              twelve = 0;
                          } else {
                              if (twelve < 10) {
                                  tArrayX[w] = 0;
                                  twelve++;
                              } else if (w != 11 && w != 49) {
                                  tArrayX[w] = 1;
                              } else {
                                  tArrayX[w] = 0;
                              }
                          }
                      }
                      tArrayY[h] = tArrayX;
                      //console.log(tArrayX);
                  }

                  let yCount = 2;
                  let tempX = 0;
                  let tempY = 0;
                  let rpo = [];
                  while (yCount < 38) {
                      let xCount = 0;
                      while (xCount < 50) {
                          if (tArrayY[yCount][xCount] == 1) {
                              let i = 1;
                              for (; i < 13; i++) {
                                  if (tArrayY[yCount + i][xCount] != 1) {
                                      break;
                                  }
                              }
                              if (i >= 12) {
                                  rpo.push(new RoomPosition(xCount - 5, yCount + 12, name));
                              }
                          }
                          xCount++;
                      }
                      yCount++;
                  }
                  try {
                      if (rpo.length == 0) {
                          return new RoomPosition(0, 0, name);
                      } else if (Memory.rooms[name].hasSpawn) {
                          return sp.pos.findClosestByRange(rpo);
                      } else {
                          return rpo[0];
                      }
                  } catch {
                      return rpo[0];
                  }
              }


              const designRoads = function() { //-----------------------------------------------------------------------DESIGN ROADS------------------------------------------------------------
                  let count = 1;
                  if (!Memory.rooms[ro].roadsAreDesigned) {
                      let path1 = Game.rooms[ro].controller.pos.findPathTo(Game.getObjectById(Memory.rooms[ro].sources[0]).pos, { swampCost: 2 });
                      path1.pop();
                      for (let p in path1) {
                          Game.rooms[ro].createFlag(path1[p]["x"], path1[p]["y"], String(count), COLOR_BLUE);
                          count++;
                      }
                      let path3 = sp.pos.findPathTo(Game.getObjectById(Memory.rooms[ro].sources[0]).pos, { swampCost: 2 });
                      path3.pop();
                      for (let p in path3) {
                          Game.rooms[ro].createFlag(path3[p]["x"], path3[p]["y"], String(count), COLOR_BLUE);
                          count++;
                      }

                      let path5 = Game.rooms[ro].find(FIND_MINERALS)[0].pos.findPathTo(sp, { swampCost: 2 });
                      path5.pop();
                      for (let p in path5) {
                          Game.rooms[ro].createFlag(path5[p]["x"], path5[p]["y"], String(count), COLOR_BLUE);
                          count++
                      }
                      try {
                          if (Memory.rooms[ro].sources[1] != "") {
                              let path2 = Game.rooms[ro].controller.pos.findPathTo(Game.getObjectById(Memory.rooms[ro].sources[1]).pos, { swampCost: 2 });
                              path2.pop();
                              for (let p in path2) {
                                  Game.rooms[ro].createFlag(path2[p]["x"], path2[p]["y"], String(count), COLOR_BLUE);
                                  count++
                              }
                              let path4 = sp.pos.findPathTo(Game.getObjectById(Memory.rooms[ro].sources[1]).pos, { swampCost: 2 });
                              path4.pop();
                              for (let p in path4) {
                                  Game.rooms[ro].createFlag(path4[p]["x"], path4[p]["y"], String(count), COLOR_BLUE);
                                  count++
                              }
                          }
                      } catch {}
                      if (Memory.rooms[ro].efap != [0, 0]) {
                          let path6 = sp.pos.findPathTo(new RoomPosition(Memory.rooms[ro].efap[0], Memory.rooms[ro].efap[1], ro), { swampCost: 2 });
                          path6.pop();
                          for (let p in path6) {
                              Game.rooms[ro].createFlag(path6[p]["x"], path6[p]["y"], String(count), COLOR_BLUE);
                              count++
                          }
                      }
                  }
                  Memory.rooms[ro].roadsAreDesigned = true;
                  if (!Memory.rooms[ro].extensionLanes) {
                      if (Memory.rooms[ro].efap != [0, 0]) {
                          let efx = Memory.rooms[ro].efap[0] - 4;
                          let efy = Memory.rooms[ro].efap[1] - 1;
                          while (efx < Memory.rooms[ro].efap[0] + 4) {
                              while (efy > Memory.rooms[ro].efap[1] - 13) {
                                  Game.rooms[ro].createFlag(efx, efy, String(count), COLOR_BLUE);
                                  count++;
                                  //console.log(Game.cpu.getUsed());
                                  efy--;
                              }
                              efy = Memory.rooms[ro].efap[1] - 1;
                              efx += 2;
                          }

                      }
                      Memory.rooms[ro].extensionLanes = true;
                  }
              }

              const repairRoads = function(cr) { //-------------------------------------------------------------------------REPAIR ROADS--------------------------------------------------------
                  let repairs = Game.rooms[ro].find(FIND_STRUCTURES, { filter: function(o) { return o.structureType == STRUCTURE_ROAD && o.hits < o.hitsMax } });
                  let repair = cr.pos.findClosestByRange(repairs);
                  if (cr.pos.getRangeTo(repair) < 5) {
                      if (cr.repair(repair) == ERR_NOT_IN_RANGE) {
                          cr.moveTo(repair);
                      }
                  }
              }

              const designExtensions = function() { //-------------------------------------------------------------------DESIGN EXTENSIONS------------------------------------------------------
                  let numberOfExtensions = 0;
                  switch (Game.rooms[ro].controller.level) {
                      case 0:
                          break;
                      case 1:
                          break;
                      case 2:
                          numberOfExtensions = 5;
                          break;
                      case 3:
                          numberOfExtensions = 10;
                          break;
                      case 4:
                          numberOfExtensions = 20;
                          break;
                      case 5:
                          numberOfExtensions = 30;
                          break;
                      case 6:
                          numberOfExtensions = 40;
                          break;
                      case 7:
                          numberOfExtensions = 50;
                          break;
                      case 8:
                          numberOfExtensions = 60;
                          break;
                  }
                  if (!Memory.rooms[ro].cecount) {
                      Memory.rooms[ro].cecount = 0;
                  }
                  if (!Memory.rooms[ro].cex) {
                      Memory.rooms[ro].cex = Memory.rooms[ro].efap[0] + 3;
                  }
                  if (!Memory.rooms[ro].cey) {
                      Memory.rooms[ro].cey = Memory.rooms[ro].efap[1] - 1;
                  }
                  if (Memory.rooms[ro].cecount < numberOfExtensions) {
                      Game.rooms[ro].createConstructionSite(Memory.rooms[ro].cex, Memory.rooms[ro].cey, STRUCTURE_EXTENSION);
                      Memory.rooms[ro].cecount = Memory.rooms[ro].cecount + 1;
                      Memory.rooms[ro].cey = Memory.rooms[ro].cey - 1;
                      if (Memory.rooms[ro].cey < Memory.rooms[ro].efap[1] - 12) {
                          Memory.rooms[ro].cey = Memory.rooms[ro].efap[1] - 1;
                          Memory.rooms[ro].cex = Memory.rooms[ro].cex - 2;
                      }
                  }
              }

              const buildFurniture = function() { //--------------------------------------------------------------------------------BUILD FURNITURE--------------------------------------------------
                  if (!Memory.rooms[ro].furnitureCoords) {
                      Memory.rooms[ro].furnitureCoords = [
                          [2, 0],
                          [2, 1],
                          [0, 1],
                          [-2, 1],
                          [-2, 0]
                      ]

                  }
                  const advance = function() {
                      if (!Memory.rooms[ro].furnitureCoordsCount) {
                          Memory.rooms[ro].furnitureCoordsCount = 0;
                      }
                      let offsetCoords = Memory.rooms[ro].furnitureCoords[Memory.rooms[ro].furnitureCoordsCount];
                      let checkCoords = Game.rooms[ro].lookAt(sp.pos.x + offsetCoords[0], sp.pos.y + offsetCoords[1], ro);
                      while (true) {
                          let checked = false;
                          for (let c in checkCoords) {
                              if (checkCoords[c].type == "structure" && checkCoords[c].structure.structureType != STRUCTURE_ROAD) {
                                  Memory.rooms[ro].furnitureCoordsCount = Memory.rooms[ro].furnitureCoordsCount + 1;
                                  offsetCoords = Memory.rooms[ro].furnitureCoords[Memory.rooms[ro].furnitureCoordsCount];
                                  checkCoords = Game.rooms[ro].lookAt(sp.pos.x + offsetCoords[0], sp.pos.y + offsetCoords[1], ro);
                                  break;
                              } else if (checkCoords[c].type == 'terrain' && checkCoords[c].terrain == STRUCTURE_WALL) {
                                  Memory.rooms[ro].furnitureCoordsCount = Memory.rooms[ro].furnitureCoordsCount + 1;
                                  offsetCoords = Memory.rooms[ro].furnitureCoords[Memory.rooms[ro].furnitureCoordsCount];
                                  checkCoords = Game.rooms[ro].lookAt(sp.pos.x + offsetCoords[0], sp.pos.y + offsetCoords[1], ro);
                                  break;
                              }
                              checked = true;
                          }
                          if (checked) {
                              break;
                          }
                      }
                      return [sp.pos.x + offsetCoords[0], sp.pos.y + offsetCoords[1], ro];
                  }

                  if (Memory.rooms[ro].needTower == true) {
                      let coords = advance();
                      Game.rooms[ro].createConstructionSite(coords[0], coords[1], STRUCTURE_TOWER);
                      Memory.rooms[ro].needTower = false;
                  }
                  if (Memory.rooms[ro].needStorage == true) {
                      let coords = advance();
                      Game.rooms[ro].createConstructionSite(coords[0], coords[1], STRUCTURE_STORAGE);
                      Memory.rooms[ro].needStorage = false;
                      coords = advance();
                      Game.rooms[ro].createFlag(coords[0], coords[1], "Link1" + ro, COLOR_WHITE);

                      if (Game.rooms[ro].getTerrain().get(Game.rooms[ro].controller.pos.x, Game.rooms[ro].controller.pos.y + 2) != 1) {
                          Game.rooms[ro].createFlag(Game.rooms[ro].controller.pos.x, Game.rooms[ro].controller.pos.y + 2, "Link2" + ro, COLOR_WHITE);
                      } else if (Game.rooms[ro].getTerrain().get(Game.rooms[ro].controller.pos.x - 2, Game.rooms[ro].controller.pos.y) != 1) {
                          Game.rooms[ro].createFlag(Game.rooms[ro].controller.pos.x - 2, Game.rooms[ro].controller.pos.y, "Link2" + ro, COLOR_WHITE);
                      } else if (Game.rooms[ro].getTerrain().get(Game.rooms[ro].controller.pos.x, Game.rooms[ro].controller.pos.y - 2) != 1) {
                          Game.rooms[ro].createFlag(Game.rooms[ro].controller.pos.x, Game.rooms[ro].controller.pos.y - 2, "Link2" + ro, COLOR_WHITE);
                      } else if (Game.rooms[ro].getTerrain().get(Game.rooms[ro].controller.pos.x + 2, Game.rooms[ro].controller.pos.y) != 1) {
                          Game.rooms[ro].createFlag(Game.rooms[ro].controller.pos.x + 2, Game.rooms[ro].controller.pos.y, "Link2" + ro, COLOR_WHITE);
                      }
                  }
                  if (Memory.rooms[ro].needTerminal == true) {
                      let coords = advance();
                      Game.rooms[ro].createConstructionSite(coords[0], coords[1], STRUCTURE_TERMINAL);
                      Memory.rooms[ro].needTerminal = false;
                  }
              }

              const spyActivities = function(cr, room) { //------------------------------------------------------------------------------SPY ACTIVITIES------------------------------------------------------------
                  if (!Memory.roomsData) {
                      Memory.roomsData = {};
                  }
                  let rn = Game.creeps[cr].room.name;
                  if (rn.match(/^\D0\D\d+/) != rn || rn.match(/^\D10\D\d+/) != rn || rn.match(/^\D\d+\D0/) != rn || rn.match(/^\D\d+\D10/) != rn) {
                      if (!Memory.roomsData[Game.creeps[cr].room.name]) {
                          Memory.roomsData[Game.creeps[cr].room.name] = {};
                      }
                      if (!Memory.roomsData[Game.creeps[cr].room.name].isHostile) {
                          Memory.roomsData[Game.creeps[cr].room.name].isHostile = Game.rooms[Game.creeps[cr].room.name].find(FIND_HOSTILE_CREEPS).length > 0;
                      }
                      if (!Memory.roomsData[Game.creeps[cr].room.name].hasInvaderCore) {
                          Memory.roomsData[Game.creeps[cr].room.name].hasInvaderCore = Game.rooms[Game.creeps[cr].room.name].find(FIND_STRUCTURES, { filter: { structureType: STRUCTURE_INVADER_CORE } }).length > 0;
                      }
                      if (!Memory.roomsData[Game.creeps[cr].room.name].numberSources) {
                          Memory.roomsData[Game.creeps[cr].room.name].numberSources = Game.rooms[Game.creeps[cr].room.name].find(FIND_SOURCES).length;
                      }
                      if (!Memory.roomsData[Game.creeps[cr].room.name].mineralType) {
                          let minerals = Game.rooms[Game.creeps[cr].room.name].find(FIND_MINERALS)
                          if (minerals.length > 0) {
                              Memory.roomsData[Game.creeps[cr].room.name].mineralType = minerals[0].mineralType;
                          } else {
                              Memory.roomsData[Game.creeps[cr].room.name].mineralType = "N/A";
                          }
                      }
                      //if (_.filter(Game.rooms, room => room).includes(Game.creeps[cr].room.name) && !Memory.roomsData[Game.creeps[cr].room.name].isSuitable) {
                      if (!Memory.roomsData[Game.creeps[cr].room.name].isSuitable) {
                          let fap = extensionFieldAnchorPoint(Game.creeps[cr].room.name);
                          let efap = [fap.x, fap.y];
                          Memory.roomsData[Game.creeps[cr].room.name].isSuitable = efap != [0, 0] && Memory.roomsData[Game.creeps[cr].room.name].numberSources == 2 && Memory.roomsData[Game.creeps[cr].room.name].isHostile == false;
                      }
                  }
                  let currentRooms = Object.keys(Memory.roomsData);
                  let nextRoom = room;
                  /*let nextRoom = false;
                  let west = ro.replace(/^W/, "");
                  west = Number(west.match(/^\d/));
                  let north = Number(ro.replace(/^W\dN/, ""));
                  let westLower = west - 2;
                  if (westLower < 1) {
                      westLower = 1;
                  }
                  let westUpper = west + 2;
                  if (westUpper >= 10) {
                      westUpper = 9;
                  }
                  let northLower = north - 2;
                  if (northLower < 1) {
                      northLower = 1;
                  }
                  let northUpper = north + 2;
                  if (northUpper >= 10) {
                      northUpper = 9;
                  }
                  for (let w = westLower; w <= westUpper; w++) {
                      for (let n = northLower; n <= northUpper; n++) {
                          let nextRooms = "W"+w+"N"+n;
                          if (!currentRooms.includes(nextRooms)) {
                              nextRoom = (new RoomPosition(25, 25, nextRooms));
                              break;
                          }                
                      }
                      if (nextRoom) {
                          break;
                      }
                  }*/
                  if (nextRoom) {
                      //Game.creeps[cr].moveTo(nextRoom);
                      Game.creeps[cr].moveTo(new RoomPosition(25, 25, nextRoom));
                  }
              }

              const remoteActivities = function() {

              }

              const colonize = function(room) {
                      let colonists = _.filter(Game.creeps, creep => creep.name.match(/^colonist/));
                      if (colonists.length == 0) { // && !Memory.rooms[room].spawnConstruction) {
                          spawnColonist2();
                      } else if (colonists.length < 2) {
                          spawnColonist2();
                      }
                      //if (!Memory.rooms[room].hasSpawn) {
                      if (true) {
                          for (let co in colonists) {
                              if (!colonists[co].memory.nextRoom) {
                                  colonists[co].memory.nextRoom = "E29N4";
                              }
                              if (colonists.length > 0 && Memory.creeps[colonists[co].name].energyStatus == "Full") {
                                  if (colonists[co].room.name == colonists[co].memory.nextRoom) {
                                      console.log("new");
                                      let count = 0;
                                      let roomPath = ["E29N4", "E30N4", "E30N5", "E30N6", "E30N7", "E31N7", "finish"];

                                      while (roomPath[count] != colonists[co].memory.nextRoom) {
                                          console.log(roomPath[count]);
                                          count++;
                                      }
                                      colonists[co].memory.nextRoom = roomPath[count + 1];

                                  } else if (colonists[co].memory.nextRoom == "finish") {
                                      if (!Game.rooms[room].controller.my) {
                                          if (colonists[co].claimController(Game.rooms[room].controller) == ERR_NOT_IN_RANGE) {
                                              colonists[co].moveTo(Game.rooms[room].controller);
                                          }
                                      } else {
                                          let fap = extensionFieldAnchorPoint(room);
                                          let xx = fap.x;
                                          let yy = fap.y;
                                          Game.rooms[room].createConstructionSite(xx, yy, STRUCTURE_SPAWN, room);
                                          Memory.rooms[room].spawnConstruction = true;
                                          let constructs = Game.rooms[room].find(FIND_CONSTRUCTION_SITES);
                                          let construct = colonists[0].pos.findClosestByRange(constructs);
                                          if (colonists[co].build(construct) == ERR_NOT_IN_RANGE) {
                                              colonists[co].moveTo(construct);
                                          }
                                      }
                                  } else {
                                      colonists[co].moveTo(new RoomPosition(25, 25, colonists[co].memory.nextRoom))
                                  }

                              } else if (Memory.creeps[colonists[co].name].energyStatus == "Empty") {
                                  let sources = Game.rooms[colonists[co].room.name].find(FIND_SOURCES);
                                  if (colonists[co].harvest(sources[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                                      colonists[co].moveTo(sources[0]);
                                  }
                              }
                          }
                      } else if (Game.rooms[room].controller.owner = "None") {
                          if (colonists.length == 1 && Memory.creeps[colonists[0].name].energyStatus == "Full") {
                              if (room != colonists[0].room.name) {
                                  colonists[0].moveTo(new RoomPosition(25, 25, room));
                              } else if (!Game.rooms[room].controller.my) {
                                  if (colonists[0].claimController(Game.rooms[room].controller) == ERR_NOT_IN_RANGE) {
                                      colonists[0].moveTo(Game.rooms[room].controller);
                                  }
                              }
                          }
                      }
                  }
                  //console.log(Game.cpu.getUsed() + "  " + ro);
              if (!Memory.rooms[ro].efap) { //--------------------------------------------------------------------------START OF TICK------------------------------------------------------
                  efap = extensionFieldAnchorPoint();

                  Memory.rooms[ro].efap = [efap.x, efap.y];
              }

              creepOrder(); // determine which creeps are needed by order of priority, add to spawnList

              spawnList.generate(); // generate creeps from spawnList in queue format

              designExtensions();

              //console.log(getRoomEnergyLevel());
              if (getRoomEnergyLevel() >= LEVEL3) {
                  designRoads();
                  let towers = Game.rooms[ro].find(FIND_STRUCTURES, { filter: { structureType: STRUCTURE_TOWER } });
                  let contowers = Game.rooms[ro].find(FIND_CONSTRUCTION_SITES, { filter: { structureType: STRUCTURE_TOWER } });
                  if (towers.length == 0 && contowers.length == 0) {
                      Memory.rooms[ro].needTower = true;
                  }
                  buildFurniture();
              }

              if (getRoomEnergyLevel() >= LEVEL4) {
                  let storages = Game.rooms[ro].find(FIND_STRUCTURES, { filter: { structureType: STRUCTURE_STORAGE } });
                  let constorages = Game.rooms[ro].find(FIND_CONSTRUCTION_SITES, { filter: { structureType: STRUCTURE_STORAGE } });
                  if (storages.length == 0 && constorages.length == 0) {
                      Memory.rooms[ro].needStorage = true;
                  }
                  remoteActivities();
                  if (storages.length == 1) {
                      Game.rooms[ro].createConstructionSite(Game.flags["Link1" + ro].pos, STRUCTURE_LINK);
                      Game.rooms[ro].createConstructionSite(Game.flags["Link2" + ro].pos, STRUCTURE_LINK);
                  }
              }

              if (getRoomEnergyLevel() >= LEVEL5) {
                  let towers = Game.rooms[ro].find(FIND_STRUCTURES, { filter: { structureType: STRUCTURE_TOWER } });
                  let contowers = Game.rooms[ro].find(FIND_CONSTRUCTION_SITES, { filter: { structureType: STRUCTURE_TOWER } });
                  if (towers.length == 1 && contowers.length == 0) {
                      Memory.rooms[ro].needTower = true;
                  }
              }

              if (getRoomEnergyLevel() >= LEVEL6) {
                  let extractors = Game.rooms[ro].find(FIND_STRUCTURES, { filter: { structureType: STRUCTURE_EXTRACTOR } });
                  let conextractors = Game.rooms[ro].find(FIND_CONSTRUCTION_SITES, { filter: { structureType: STRUCTURE_EXTRACTOR } });
                  let minerals = Game.rooms[ro].find(FIND_MINERALS);
                  if (extractors.length == 0 && conextractors.length == 0) {
                      Game.rooms[ro].createConstructionSite(minerals[0], STRUCTURE_EXTRACTOR);
                  }
                  let terminals = Game.rooms[ro].find(FIND_STRUCTURES, { filter: { structureType: STRUCTURE_TERMINAL } });
                  let conterminals = Game.rooms[ro].find(FIND_CONSTRUCTION_SITES, { filter: { structureType: STRUCTURE_TERMINAL } });
                  if (terminals.length == 0 && conterminals.length == 0) {
                      Memory.rooms[ro].needTerminal = true;
                  }
                  let cashCows = _.filter(Game.creeps, creep => creep.name.match(/^cashCow/));
                  if (extractors.length == 1 && terminals.length == 1) {
                      if (cashCows.length == 0) {
                          //spawnCashCow();
                      }
                  }
              }

              if (_.filter(Game.creeps, creep => creep.room.name == ro).length == 0) {

                  spawnMiner(300);
              }

              if (_.filter(Game.creeps, creep => creep.room.name == ro).length == 1) {
                  spawnSpawnFiller(300);
              }

              //colonize("E31N7");
              //console.log(Game.cpu.getUsed() + "  " + ro);
              for (let cr in Game.creeps) { //-----------------------------------------------------------------------------------CREEPS LOOP----------------------------------------------------------

                  let flagues = Game.rooms[ro].find(FIND_FLAGS, { filter: { color: COLOR_BLUE } });
                  let flague = Game.creeps[cr].pos.findClosestByRange(flagues);
                  let constructs = Game.creeps[cr].room.find(FIND_CONSTRUCTION_SITES);
                  let construct = Game.creeps[cr].pos.findClosestByRange(constructs);
                  let controller = Game.rooms[Game.creeps[cr].room.name].controller;
                  let repairs = Game.creeps[cr].room.find(FIND_STRUCTURES, { filter: function(o) { return o.structureType == STRUCTURE_ROAD && o.hits < o.hitsMax } });
                  let rep = Game.creeps[cr].pos.findClosestByRange(repairs);
                  let cashCows = _.filter(Game.creeps, creep => creep.name.match(/^cashCow/));
                  let minerals = Game.rooms[Game.creeps[cr].room.name].find(FIND_MINERALS);
                  let terminals = Game.rooms[Game.creeps[cr].room.name].find(FIND_STRUCTURES, { filter: { structureType: STRUCTURE_TERMINAL } });
                  let links = Game.creeps[cr].room.find(FIND_STRUCTURES, { filter: { structureType: STRUCTURE_LINK } });
                  let link1;
                  let link2;
                  try {
                      if (links.length > 1) {
                          link1 = Game.flags["Link1" + Game.creeps[cr].room.name].pos.findClosestByRange(links);
                          link2 = Game.flags["Link2" + Game.creeps[cr].room.name].pos.findClosestByRange(links);

                      }
                  } catch {}

                  let cfl = {
                      "E29N4": new RoomPosition(8, 44, "E29N4"),
                      "E31N7": new RoomPosition(16, 17, "E31N7")
                  };
                  let bfl = {
                      "E29N4": new RoomPosition(9, 44, "E29N4"),
                      "E31N7": new RoomPosition(15, 17, "E31N7")
                  };
                  let efl = { "E29N4": new RoomPosition(17, 36, "E29N4") };



                  /*if (Game.creeps[cr].name.match(/^builder/) && Game.creeps[cr].room.name != "E29N4") {
                      Memory.creeps[cr].homeRoom = "E31N7";
                  }*/

                  //Game.creeps[cr].say(cr.match(/\D+/));
                  getEnergyStatus(cr);
                  if (Memory.creeps[cr].energyStatus == "Empty" && !cr.match(/^colonist/)) {
                      if (cr.match(/^spy/)) {
                          spyActivities(cr, "E31N7");
                      }
                      if (cr.match(/^transferer/)) {
                          Game.creeps[cr].moveTo(new RoomPosition(Game.flags["Link1" + Memory.creeps[cr].homeRoom].pos.x + 1, Game.flags["Link1" + Memory.creeps[cr].homeRoom].pos.y, Memory.creeps[cr].homeRoom));
                          Game.creeps[cr].withdraw(Game.rooms[ro].storage, RESOURCE_ENERGY);
                      }

                      if (cr.match(/^controllerFiller/) && Game.rooms[ro].controller.level >= 5) {
                          if (Game.creeps[cr].withdraw(link2, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                              Game.creeps[cr].moveTo(link2);
                              continue;
                          }
                      }
                      if (!Memory.creeps[cr].source) {
                          if (cr.match(/^miner/)) {
                              Memory.creeps[cr].source = getSourceId("source", cr);
                          } else {
                              Memory.creeps[cr].source = getSourceId("resource", cr);
                          }
                      }
                      if (Memory.creeps[cr].source[1] == "source") {
                          if (cr.match(/^spawnFiller/)) {
                              Memory.creeps[cr].source = getSourceId("resource", cr);
                              if (Memory.creeps[cr].source[1] == "source") {
                                  if (Game.creeps[cr].withdraw(Game.rooms[ro].storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                                      Game.creeps[cr].moveTo(Game.rooms[ro].storage);
                                  }
                              }
                          }
                          if (!Game.creeps[cr].name.match(/^miner/) && Memory.creeps[cr].source[1] == "source") {
                              if (Game.creeps[cr].memory.homeRoom == "E31N4") {
                                  console.log(Game.creeps[cr].harvest(Game.getObjectById(Memory.creeps[cr].source[0].id)));
                                  if (Game.creeps[cr].harvest(Game.getObjectById(Memory.creeps[cr].source[0].id)) == ERR_NOT_IN_RANGE) {
                                      Game.creeps[cr].moveTo(Game.getObjectById(Memory.creeps[cr].source[0].id));
                                  }
                              } else {
                                  if (Memory.creeps[cr].source[0] == null) {
                                      Memory.creeps[cr].source = getSourceId("resource", cr);
                                  }
                                  try {
                                      if (Game.getObjectById(Memory.creeps[cr].source[0]).pos.findInRange(FIND_MY_CREEPS, 2, { filter: function(o) { return o.name.match(/^miner/) } }).length > 0) {
                                          Memory.creeps[cr].source = getSourceId("resource", cr);
                                      }
                                  } catch {}
                              }
                          }
                          if (Game.creeps[cr].harvest(Game.getObjectById(Memory.creeps[cr].source[0])) == ERR_NOT_IN_RANGE) {
                              Game.creeps[cr].moveTo(Game.getObjectById(Memory.creeps[cr].source[0]));
                          }
                      } else if ((cr.match(/^controllerFiller/) && Game.creeps[cr].room.controller.level < 5) || !cr.match(/^controllerFiller/)) {
                          /*if (cr.match(/^builder/) || cr.match(/^controllerFiller/) || cr.match(/^colonist/)) {
                              if (Game.creeps[cr].withdraw(Game.rooms[ro].storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                                  Game.creeps[cr].moveTo(Game.rooms[ro].storage);
                                  continue;
                              }
                          }*/
                          if (Game.creeps[cr].pickup(Game.getObjectById(Memory.creeps[cr].source[0])) == ERR_INVALID_TARGET) {
                              Memory.creeps[cr].source = getSourceId("resource", cr);
                          }
                          if (Game.creeps[cr].pickup(Game.getObjectById(Memory.creeps[cr].source[0])) == ERR_NOT_IN_RANGE) {
                              Game.creeps[cr].moveTo(Game.getObjectById(Memory.creeps[cr].source[0]));
                          }
                      }
                      if (cr.match(/^cashCow/)) {
                          console.log(minerals[0].mineralType);
                          if (Game.creeps[cr].store.getFreeCapacity(minerals[0].mineralType) > 0) {
                              Game.creeps[cr].moveTo(efl[Memory.creeps[cr].homeRoom]);
                              if (Game.creeps[cr].harvest(minerals[0]) == ERR_NOT_IN_RANGE) {
                                  Game.creeps[cr].moveTo(efl[Memory.creeps[cr].homeRoom]);
                              }
                          }
                      }

                  } else {
                      delete Memory.creeps[cr].source;
                      if (links.length > 1) {
                          if (link1.store.getFreeCapacity(RESOURCE_ENERGY) == 0) {
                              link1.transferEnergy(link2);
                          }
                      }

                      if (!Memory.repairTime) {
                          Memory.repairTime = Game.time;
                      }

                      if (cr.match(/^cashCow/)) {
                          if (Game.creeps[cr].transfer(terminals[0], minerals[0].mineralType) == ERR_NOT_IN_RANGE) {
                              Game.creeps[cr].moveTo(terminals[0]);
                          }
                      }

                      if (cr.match(/^spawnFiller/) && Game.creeps[cr].room.name == Memory.creeps[cr].homeRoom) {

                          let emptyTowers = Game.rooms[ro].find(FIND_STRUCTURES, { filter: function(o) { return o.structureType == STRUCTURE_TOWER && o.store.getFreeCapacity(RESOURCE_ENERGY) > 0 } });
                          if (sp.room.name == Game.creeps[cr].room.name && sp.store.getFreeCapacity(RESOURCE_ENERGY) > 0) {

                              if (Game.creeps[cr].transfer(sp, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                                  Game.creeps[cr].moveTo(sp, { maxRooms: 1, ignoreCreeps: true });
                              }
                          } else if (Game.rooms[Game.creeps[cr].room.name].energyAvailable < Game.rooms[Game.creeps[cr].room.name].energyCapacityAvailable) {
                              console.log("marty");
                              let extensions = Game.creeps[cr].room.find(FIND_STRUCTURES, {
                                  filter: function(o) {
                                      return o.structureType == STRUCTURE_EXTENSION &&
                                          o.store.getFreeCapacity(RESOURCE_ENERGY) > 0
                                  }
                              });
                              let extension = Game.creeps[cr].pos.findClosestByRange(extensions);
                              if (Game.creeps[cr].transfer(extension, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                                  Game.creeps[cr].moveTo(extension, { maxRooms: 1, ignoreCreeps: true });
                              }
                          } else if (emptyTowers.length > 0) {

                              if (Game.creeps[cr].transfer(emptyTowers[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                                  Game.creeps[cr].moveTo(emptyTowers[0]);
                              }
                          } else {
                              let storages = Game.creeps[cr].room.find(FIND_STRUCTURES, { filter: { structureType: STRUCTURE_STORAGE } });
                              if (storages.length > 0) {
                                  if (Game.creeps[cr].transfer(Game.rooms[Game.creeps[cr].room.name].storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                                      Game.creeps[cr].moveTo(Game.rooms[Game.creeps[cr].room.name].storage, { maxRooms: 1, ignoreCreeps: true });
                                  }
                              }
                          }

                      } else if (cr.match(/^builder/) && Game.creeps[cr].room.name == Memory.creeps[cr].homeRoom) {
                          if (Game.time >= Memory.repairTime + 4500) {
                              if (Game.creeps[cr].repair(rep) == ERR_NOT_IN_RANGE) {
                                  Game.creeps[cr].moveTo(rep);
                                  if (!Memory.repairNumber) {
                                      Memory.repairNumber = 0
                                  }
                                  Memory.repairNumber = Memory.repairNumber + 1;
                              }
                              if (Game.creeps[cr].repair(rep) == ERR_INVALID_TARGET) {
                                  delete Memory.repairTime;
                                  delete Memory.repairNumber;
                              }

                              if (Memory.repairNumber == 1500) {
                                  delete Memory.repairTime;
                                  delete Memory.repairNumber;
                              }
                          } else if (construct) {
                              if (Game.creeps[cr].build(construct) == ERR_NOT_IN_RANGE) {
                                  Game.creeps[cr].moveTo(construct, { maxRooms: 1 });
                              }
                          } else if (flague) {
                              let tempConstruct = flague.pos;
                              flague.remove();
                              Game.rooms[ro].createConstructionSite(tempConstruct, STRUCTURE_ROAD);
                          } else {
                              Game.creeps[cr].moveTo(bfl[Memory.creeps[cr].homeRoom]);
                              if (Game.creeps[cr].transfer(Game.creeps[cr].room.controller, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                                  Game.creeps[cr].moveTo(Game.creeps[cr].room.controller, { maxRooms: 1 });
                              }
                          }

                      } else if (cr.match(/^builder/) && Game.creeps[cr].room.name != Memory.creeps[cr].homeRoom) {
                          Game.creeps[cr].moveTo(new RoomPosition(25, 25, Memory.creeps[cr].homeRoom));

                      } else if (cr.match(/^controllerFiller/) && Game.creeps[cr].room.name == Memory.creeps[cr].homeRoom) {
                          Game.creeps[cr].moveTo(cfl[Memory.creeps[cr].homeRoom]);
                          if (Game.creeps[cr].transfer(Game.creeps[cr].room.controller, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                              Game.creeps[cr].moveTo(cfl[Memory.creeps[cr].homeRoom]);
                              continue;
                          }
                      } else if (cr.match(/^transferer/)) {
                          Game.creeps[cr].moveTo(new RoomPosition(Game.flags["Link1" + Memory.creeps[cr].homeRoom].pos.x + 1, Game.flags["Link1" + Memory.creeps[cr].homeRoom].pos.y, Memory.creeps[cr].homeRoom));
                          Game.creeps[cr].transfer(link1, RESOURCE_ENERGY);
                      }
                  }
              }
              let towers = Game.rooms[ro].find(FIND_STRUCTURES, { filter: { structureType: STRUCTURE_TOWER } });
              let whiteList = ["Q13214", "wtfrank", "Orlet", "slowmotionghost", "MarvinTMB"];
              let invaders = Game.rooms[ro].find(FIND_HOSTILE_CREEPS, { filter: function(o) { if (!whiteList.includes(o.owner.username)) { return o } } });
              for (let t in towers) {
                  if (invaders[0] != "") {
                      towers[t].attack(invaders[0]);
                  }
              }
          }
          //console.log(Game.cpu.getUsed() + "  " + ro);
          //console.log(Game.rooms["E31N7"].controller.progress);
      }
  }