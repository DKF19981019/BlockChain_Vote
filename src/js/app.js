App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',

initWeb3: async function() {

  if (window.ethereum) {
    App.web3Provider = window.ethereum;
    try {
      await window.ethereum.enable();
    } catch (error) {
      console.error("用户允许此操作")
    }
  }
  else if (window.web3) {
    App.web3Provider = window.web3.currentProvider;
  }
  else {
    App.web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');
  }
  web3 = new Web3(App.web3Provider);

},
  initIndex: function () {
    this.initWeb3();
    $.getJSON('Collection.json', function (data) {
      App.contracts.Collection = TruffleContract(data);
      App.contracts.Collection.setProvider(App.web3Provider);
      App.contracts.Collection.deployed().then(function (instance) {
        collection = instance;
        return collection.getAllBallots();
      }).then(function (result) {
        $.getJSON('Election.json', function (data) {
          App.contracts.Election = TruffleContract(data);
          App.contracts.Election.setProvider(App.web3Provider);
          App.renderBallot(result, 0);
        });
      }).catch(function (error) {
        console.log(error);
      });
    });
  },
  //页面加载
  renderBallot: function (addresses, i) {
    if (i < addresses.length) {
      var election = App.contracts.Election.at(addresses[i]);
      election.info().then(function (result) {
        var tip='Please Sign in';
        var dom = '<tr>';
        dom += '<td>' + result[0] + '</td>';   
        dom += '<td>' + result[1] + '</td>';
        dom += '<td>' + App.byte32ToString(result[2]) + '</td>';
        if(App.getQueryVariable("name")==""){
          dom += '<td>' +tip+'</td>';
      }else{
        dom += '<td>' +
            '<a href="vote.html?address=' + addresses[i] + '" style="color: #4b5cc4">Enter    <a href="javascript: void(0);" onclick="App.closeBallot(\'' + addresses[i] + '\');" style="color: #4b5cc4">  Delete' +
            '</a></td>';
      }
        dom += '</tr>';
        $(dom).appendTo("#ballot_tb tbody");
        App.renderBallot(addresses, i + 1);
      }).catch(function (error) {
        console.log(error);
      });
    }
  },
  //初始化添加页面
  initAddBallot: function () {
    this.initWeb3();
    $.getJSON('Collection.json', function (data) {
      App.contracts.Collection = TruffleContract(data);
      App.contracts.Collection.setProvider(App.web3Provider);
    });
  },
  //添加投票信息
  addBallotSubmit: function () {
    var ballotName = $("#inputName").val();
    var proposals_arry = $("#inputProposals").val().split(",");
    var byte32_arry = new Array(proposals_arry.length);
    if(ballotName==""||proposals_arry==""){
      alert("请完善投票信息！");
      return false;
    }else{
    for (var i = 0; i <proposals_arry.length; i++) {
      byte32_arry[i] = App.stringToBytes32(proposals_arry[i]);
    }
    App.contracts.Collection.deployed().then(function (instance) {
      collection = instance;
      web3.eth.defaultAccount = web3.eth.coinbase;
      return collection.addBallot(ballotName, byte32_arry, { gas: 3000000 });
    }).then(function (result) {
      console.log(result);
      alert("添加成功");
      history.back(-1); 
    }).catch(function (error) {
      console.log(error);
    });
    return false;
  }
  },
   //删除投票
   closeBallot:function(address){
    App.contracts.Collection.deployed().then(function (instance) {
      collection = instance;
//       web3.eth.defaultAccount = web3.eth.coinbase;
      return collection.delBallot(address);
    }).then(function (result) {
      console.log("删除结果:"+result);
      alert("删除成功");
      history.go(0);
    }).catch(function (error) {
      console.log(error);
    });
    
},
  //投票界面初始化
  initVote: function () {
    this.initWeb3();
    var electionInstance;
    //获得账号信息
    web3.eth.getCoinbase(function (err, account) {
      if (err === null) {
        App.account = account;
          $("#accountAddress").html("Your address: " + account);
      }
    });
    $.getJSON("Election.json", function (election) {
      App.contracts.Election = TruffleContract(election);
      App.contracts.Election.setProvider(App.web3Provider);
      App.contracts.Election.at(App.getQueryVariable('address')).then(function (instance) {
        electionInstance = instance;
        return electionInstance.candidateCount();
      }).then(function (candidatesCount) {
        var $candidatesResults = $("#candidatesResults");
        $candidatesResults.empty();
        var $cadidatesSelect = $("#cadidatesSelect");
        $cadidatesSelect.empty();
        for (var i = 1; i <= candidatesCount; i++) {
          electionInstance.candidates(i).then(function (candidate) {
            var id = candidate[0];
            var name = candidate[1];
            var voteCount = candidate[2];
            var candidateTemplate = "<tr><th>" + id + "</th><td>" + App.byte32ToString(name) + "</td><td>" + voteCount + "</td></tr>";
            $candidatesResults.append(candidateTemplate);
            var cadidateOption = "<option value='" + id + "'>" + App.byte32ToString(name) + "</option>";
            $cadidatesSelect.append(cadidateOption);

          });
        }
        return electionInstance.voters(App.account);
      }).then(function (hasVoted) {

        if (hasVoted) {
          $('form').hide();
          var c = $("#accountAddress").html();
          $("#accountAddress").html(c + "</br>" + "(此地址已参与投票)");
        }
      }).catch(function (err) {
        console.warn('90raw');
      });

    })
  },

  //投票
  castVote: function () {
    var candidateId = $('#cadidatesSelect').val();
    var address_ = App.getQueryVariable('address');
    App.contracts.Election.at(address_).then(function (instance) {
      return instance.vote(candidateId, { from: App.account });
    }).then(function (result) {
      location = "vote.html?address=" + address_;
    }).catch(function (err) {
      console.warn(err);
    });

  },

  //获取地址中的参数
  getQueryVariable: function (variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split("=");
      if (pair[0] == variable) { return pair[1]; }
    }
    return (false);
  },

  byte32ToString: function (raw) {
    var nums = [];
    for (var i = 2; i < 66; i += 2) {
      nums.push(parseInt(raw.substr(i, 2), 16));
    }

    return this.toUTF8(nums);
  },

  toUTF8: function (bytes) {
    var utf8 = '';
    for (var i = 0; i < bytes.length; i++) {
      var binary = bytes[i].toString(2),
        v = binary.match(/^1+?(?=0)/);

      if (v && binary.length == 8) {
        var bytesLength = v[0].length;
        var store = bytes[i].toString(2).slice(7 - bytesLength);
        for (var st = 1; st < bytesLength; st++) {
          store += bytes[st + i].toString(2).slice(2);
        }
        utf8 += String.fromCharCode(parseInt(store, 2));
        i += bytesLength - 1;
      } else {
        utf8 += String.fromCharCode(bytes[i]);
      }
    }

    return utf8;
  },

  stringToBytes32: function (raw) {
    var bytes = this.fromUTF8(raw);

    var bytes32 = '0x';
    for (var i in bytes) {
      bytes32 += bytes[i].toString(16);
    }

    while (bytes32.length < 66) {
      bytes32 += '0';
    }

    return bytes32;
  },
  fromUTF8: function (str, isGetBytes) {
    var back = [];
    var byteSize = 0;
    for (var i = 0; i < str.length; i++) {
      var code = str.charCodeAt(i);
      if (0x00 <= code && code <= 0x7f) {
        byteSize += 1;
        back.push(code);
      } else if (0x80 <= code && code <= 0x7ff) {
        byteSize += 2;
        back.push((192 | (31 & (code >> 6))));
        back.push((128 | (63 & code)))
      } else if ((0x800 <= code && code <= 0xd7ff)
        || (0xe000 <= code && code <= 0xffff)) {
        byteSize += 3;
        back.push((224 | (15 & (code >> 12))));
        back.push((128 | (63 & (code >> 6))));
        back.push((128 | (63 & code)))
      }
    }
    for (i = 0; i < back.length; i++) {
      back[i] &= 0xff;
    }
    if (isGetBytes) {
      return back
    }
    if (byteSize <= 0xff) {
      return [0, byteSize].concat(back);
    } else {
      return [byteSize >> 8, byteSize & 0xff].concat(back);
    }
  },
};

particlesJS('particles-js',
  
  {
    "particles": {
      "number": {
        "value": 60,
        "density": {
          "enable": true,
          "value_area": 1000
        }
      },
      "color": {
        "value": "#ffffff"
      },
      "shape": {
        "type": "circle",
        "stroke": {
          "width": 0,
          "color": "#000000"
        },
        "polygon": {
          "nb_sides": 5
        },
        "image": {
          "src": "img/github.svg",
          "width": 100,
          "height": 100
        }
      },
      "opacity": {
        "value": 0.5,
        "random": false,
        "anim": {
          "enable": false,
          "speed": 1,
          "opacity_min": 0.1,
          "sync": false
        }
      },
      "size": {
        "value": 5,
        "random": true,
        "anim": {
          "enable": false,
          "speed": 30,
          "size_min": 0.1,
          "sync": false
        }
      },
      "line_linked": {
        "enable": true,
        "distance": 200,
        "color": "#ffffff",
        "opacity": 0.4,
        "width": 1
      },
      "move": {
        "enable": true,
        "speed": 6,
        "direction": "none",
        "random": false,
        "straight": false,
        "out_mode": "out",
        "attract": {
          "enable": false,
          "rotateX": 600,
          "rotateY": 1200
        }
      }
    },
    "interactivity": {
      "detect_on": "canvas",
      "events": {
        "onhover": {
          "enable": true,
          "mode": "repulse"
        },
        "onclick": {
          "enable": true,
          "mode": "push"
        },
        "resize": true
      },
      "modes": {
        "grab": {
          "distance": 400,
          "line_linked": {
            "opacity": 1
          }
        },
        "bubble": {
          "distance": 400,
          "size": 40,
          "duration": 2,
          "opacity": 8,
          "speed": 3
        },
        "repulse": {
          "distance": 200
        },
        "push": {
          "particles_nb": 4
        },
        "remove": {
          "particles_nb": 2
        }
      }
    },
    "retina_detect": true,
    "config_demo": {
      "hide_card": false,
      "background_color": "#b61924",
      "background_image": "",
      "background_position": "50% 50%",
      "background_repeat": "no-repeat",
      "background_size": "cover"
    }
  }

);