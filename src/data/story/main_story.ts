import type { StoryData } from "../../types";
import {
  increaseAffection,
  setMetCharacter,
  setGameFlag,
  hasMet,
  affectionAbove,
  effects,
  decreaseAffection,
  checkAndTriggerSideQuests,
  determineAndTriggerEnding,
  unlockPhoneFeature,
  advanceToNextDay,
} from "../../utils/storyHelpers";

export const MAIN_STORY: StoryData = {
  start: {
    id: "start",
    sceneId: "black_screen",
    text: [
      "微風拂過臉頰，帶著夏日的氣息。",
      "今天，是我大學生活的第一天，也是我選修了網球體育課的第一天。",
      "「希望能順利通過體育課呀...」",
    ],
    nextNodeId: "arrive_court",
    audio: { bgm: "bgm_peaceful.mp3" },
  },
  arrive_court: {
    id: "arrive_court",
    sceneId: "tennis_court_day",
    text: "（深吸一口氣，踏入了網球場...好多人啊。）",
    nextNodeId: "meet_coach_A_1",
  },
  meet_coach_A_1: {
    id: "meet_coach_A_1",
    sceneId: "tennis_court_day",
    characterId: "coach",
    spriteExpression: "default",
    text: [
      "歡迎大家選修體育課，我是體育課老師。",
      "欸那邊那位同學，有事嗎？",
      "「這老師感覺好可怕...」",
    ],
    effects: effects(setMetCharacter("coach")),
    nextNodeId: "meet_coach_A_2",
  },
  meet_coach_A_2: {
    id: "meet_coach_A_2",
    sceneId: "tennis_court_day",
    text: [
      "「先好好練好正拍吧...」",
      "同學小心球 !!! (網球快速朝臉飛來)",
      "(快速閃身!!!)",
      "「好險我反應很快...」",
      "「搞什麼東西啊(╬☉д⊙)」",
    ],
    nextNodeId: "meet_coach_A_3",
  },
  meet_coach_A_3: {
    id: "meet_coach_A_3",
    sceneId: "tennis_court_day",
    spriteExpression: "default",
    characterId: "coach",
    text: [
      "那邊那位同學，沒事齁？",
      "「我...我沒事。」",
      "我看妳反應很快，不然就不用戴牙套了。",
      "(媽逼得有禮貌嗎你)",
    ],
    nextNodeId: "meet_coach_A_4",
  },
  meet_coach_A_4: {
    id: "meet_coach_A_4",
    sceneId: "tennis_court_day",
    characterId: "coach",
    spriteExpression: "default",
    text: "哈哈哈開玩笑的，我看妳骨骼驚奇，有興趣來網球隊試試看嗎？",
    choices: [
      {
        text: "「當然啦，我鐵定有天分的。」",
        nextStoryNodeId: "coach_A_react_1",
        effects: effects(
          increaseAffection("coach", 5),
          setGameFlag("player_introduced", true)
        ),
      },
      {
        text: "「摁....可以試試看」",
        nextStoryNodeId: "coach_A_react_1",
        effects: effects(setGameFlag("coach", true)),
      },
      {
        text: "「不要。」",
        nextStoryNodeId: "final_day_checkpoint",
      },
    ],
  },
  coach_A_react_1: {
    id: "coach_A_react_1",
    sceneId: "tennis_court_day",
    characterId: "coach",
    spriteExpression: "happy",
    text: [
      "喔？不錯歐，有慧根。",
      "你剛好可以從球經開始當，等等先去幫我買竹林雞肉飯。",
      "「歐...歐歐好的教練」",
      "很好，對了我們練球是一三晚上7點，記得要提早來熱身。",
      "「好的。」",
    ],
    nextNodeId: "meet_coach_A_5",
  },
  meet_coach_A_5: {
    id: "meet_coach_A_5",
    sceneId: "tennis_court_day",
    text: [
      "「真是奇怪的教練..」",
      "「今天剛好是禮拜一，晚上去看看吧。」",
      "(順便看看有什麼帥哥(,,Ծ 3 Ծ,,))",
      "「哎呀不想了，還是先去買雞肉飯吧。」",
    ],
    nextNodeId: "event_joined_club",
  },

  event_joined_club: {
    id: "event_joined_club",
    text: "",
    nodeType: "eventTitle",
    sceneId: "tennis_court_day",
    eventTitleText: "第一章\n加入了網球隊",
    nextNodeId: "common_night",
  },

  common_night: {
    id: "common_night",
    sceneId: "tennis_court_night",
    text: [
      "（到了晚上)",
      "「晚上的燈光好刺眼阿，是因為外面的足球仔嗎？」",
      "「不知道去外面踢球會不會被退隊？」",
    ],
    nextNodeId: "day_0_training",
  },

  day_0_training: {
    id: "day_0_training",
    sceneId: "tennis_court_night",
    characterId: "senpai_A",
    spriteExpression: "default",
    text: [
      "Yo, Welcome你加入Tennis隊！",
      "我是網球隊的男隊長，可以叫我網球隊的男隊長。",
      "教練有和我說今天有新的球經來σ(´∀｀*)",
      "剛加入要加一下Facebook好友喔，我來把你加入群組。",
    ],
    effects: effects(setMetCharacter("senpai_A")),
    nextNodeId: "day_0_training_1",
  },

  day_0_training_1: {
    id: "day_0_training_1",
    sceneId: "tennis_court_night",
    characterId: "senpai_A",
    spriteExpression: "default",
    text: "你叫什麼名字？",
    choices: [
      {
        text: "「我叫做肉泥(๑•̀ㅂ•́)و✧」",
        nextStoryNodeId: "day_0_training_1_react_1",
        effects: effects(increaseAffection("senpai_A", 1)),
      },
      {
        text: "「誰理你啊( ´-ω ･)▄︻┻┳══━」",
        nextStoryNodeId: "day_0_training_1_react_2",
        effects: effects(decreaseAffection("senpai_A", 5)),
      },
      {
        text: "「靠北隊長好帥歐(｡ŏ_ŏ)」",
        nextStoryNodeId: "day_0_training_1_react_3",
        effects: effects(increaseAffection("senpai_A", 5)),
      },
    ],
  },

  day_0_training_1_react_1: {
    id: "day_0_training_1_react_1",
    sceneId: "tennis_court_night",
    characterId: "senpai_A",
    spriteExpression: "default",
    text: [
      "肉泥...(翻找手機)",
      "有了找到了！加你到Facebook社團囉！",
      "(都幾年了還有人在用FB社團...)",
    ],
    nextNodeId: "phone_unlocked_notice", 
  },
  day_0_training_1_react_2: {
    id: "day_0_training_1_react_2",
    sceneId: "tennis_court_night",
    characterId: "senpai_A",
    spriteExpression: "default",
    text: [
      "窩曹是個辣蹄子，沒事教練有跟我說你叫做肉泥。",
      "我把你加到Facebook社團囉！",
      "(都幾年了還有人在用FB社團...)",
    ],
    nextNodeId: "phone_unlocked_notice", 
  },
  day_0_training_1_react_3: {
    id: "day_0_training_1_react_3",
    sceneId: "tennis_court_night",
    characterId: "senpai_A",
    spriteExpression: "default",
    text: [
      "這基本的。",
      "我把你加到Facebook社團囉！",
      "(都幾年了還有人在用FB社團...)",
    ],
    nextNodeId: "phone_unlocked_notice", 
  },


  'phone_unlocked_notice': {
    id: 'phone_unlocked_notice',
    sceneId: 'tennis_court_night', 
    text: "（手機功能已解鎖！可以點擊左上角的按鈕查看日期和行程了。）",
    effects: effects(
      unlockPhoneFeature() 
    ),
    nextNodeId: 'day_0_training_2',
},
day_0_training_2: {
  id: "day_0_training_2",
  sceneId: "tennis_court_night",
  text: ["就這樣第一天練球開始了...",],
  nextNodeId: "day_0_training_2_1",
},
day_0_training_2_1: {
  id: "day_0_training_2_1",
  sceneId: "tennis_court_night",
  characterId: "classmate_yu",
  spriteExpression: "default",
  text: ["ㄟㄟ你有人熱身了嗎？",
    "(這人怎麼怪沒禮貌的)",
    "「還沒耶。」",
    "太好了那你要一起熱身嗎？",
    "「額...好呀，但我不太會打。」",
    "沒事拉我可以教你！",
  ],
  effects: effects(setMetCharacter("classmate_yu")),
  nextNodeId: "day_0_training_2_2",
},
day_0_training_2_2: {
  id: "day_0_training_2_2",
  sceneId: "tennis_court_night",
  text: ["就這樣跟馮同學打了一陣子...",],
  nextNodeId: "day_0_training_2_3",
},
day_0_training_2_3: {
  id: "day_0_training_2_3",
  sceneId: "tennis_court_night",
  spriteExpression: "default",
  characterId: "classmate_yu",
  text: ["你打得其實不錯ㄟ，除了蠻可憐的以外都還可以。",
    "「你才可憐吧你。」",
    "對了你有看到角落黑黑那邊有一個人嗎？",
    "(仔細尋找)",
    "「ㄟ那個是人嗎？」",
    "對阿那個人是網球隊的傳說人物，人稱老不死的家哥，沒有人知道他在那個角落活了多久。",
    "傳說他已經打了87屆大專盃了。",
    "「靠北怎麼可能，他是讀幾個博士。」",
    "對阿怎麼可能我只是想說你是87而已，呵呵(⁰▿⁰)",
    "(..........)",
  ],
  nextNodeId: "day_0_training_2_4",
},

day_0_training_2_4: {
  id: "day_0_training_2_4",
  sceneId: "tennis_court_night",
  characterId: "coach",
  spriteExpression: "default",
  text: [
    "大家來集合了！",
  ],
  nextNodeId: "day_0_training_2_5", 
},
day_0_training_2_5: {
  id: "day_0_training_2_5",
  sceneId: "tennis_court_night",
  characterId: "coach",
  spriteExpression: "default", 
  text: "今天有新的同學加入，來當我們的球經，來介紹一下你自己，大概10分鐘就可以了。",
  choices: [
    {
      text: "「大...大家好，我叫做肉泥，現在就讀資工系，會加入網球隊是因為在網球課教練問我。」",
      nextStoryNodeId: "day_0_training_2_5_1",
    },
    {
      text: "「大家好，我~~~~~是來追男森的<3 <3 (雙手比愛心)」",
      nextStoryNodeId: "day_0_training_2_5_2",
    }
  ],
},
day_0_training_2_5_1: {
  id: "day_0_training_2_5_1",
  sceneId: "tennis_court_night",
  characterId: "coach",
  spriteExpression: "default",
  text: [
    "還有9分半喔。",
  ],
  nextNodeId: "day_0_training_2_6", 
},
day_0_training_2_5_2: {
  id: "day_0_training_2_5_2",
  sceneId: "tennis_court_night",
  characterId: "all",
  spriteExpression: "default",
  text: [
    "(震驚!!!!!!!!!!!!!!!!!)",
    "(集體倒地)",
    "(休克)",
    "(~~~救護車聲~~~)",
    "(一小時之後....)",
  ],
  nextNodeId: "day_0_training_2_6", 
},
day_0_training_2_6: {
  id: "day_0_training_2_6",
  sceneId: "tennis_court_night",
  characterId: "coach",
  spriteExpression: "default",
  text: [
    "好吧，有人要問肉泥什麼問題嗎？",
  ],
  nextNodeId: "day_0_training_2_7", 
},
day_0_training_2_7: {
  id: "day_0_training_2_7",
  sceneId: "tennis_court_night",
  characterId: "classmate_yu",
  spriteExpression: "default",
  text: [
    "我!",
    "請問你是87嗎？",
    "(......)",
  ],
  nextNodeId: "day_0_training_2_8", 
},
day_0_training_2_8: {
  id: "day_0_training_2_8",
  sceneId: "tennis_court_night",
  characterId: "coach",
  spriteExpression: "default",
  text: [
    "你問那什麼問題，你有事嗎？",
    "你夠老嗎？",
    "你有家哥老嗎？",
  ],
  nextNodeId: "day_0_training_2_9", 
},
day_0_training_2_9: {
  id: "day_0_training_2_9",
  sceneId: "tennis_court_night",
  characterId: "all",
  spriteExpression: "default",
  text: [
    "(眾人看往網球場遠方的黑暗角落)",
  ],
  nextNodeId: "day_0_training_2_10", 
},
day_0_training_2_10: {
  id: "day_0_training_2_10",
  sceneId: "tennis_court_night",
  characterId: "classmate_yu",
  spriteExpression: "default",
  text: [
    "沒...沒有，教練對不起。",
  ],
  nextNodeId: "day_0_training_2_11", 
},
day_0_training_2_11: {
  id: "day_0_training_2_11",
  sceneId: "tennis_court_night",
  characterId: "coach",
  spriteExpression: "default",
  text: [
    "怪怪的，那接下來幫你介紹一個師傅，",
    "以後妳的師父就是這個怪怪的馮同學知道嗎？",
    "「喔喔...好」(感覺以後的日子難過了)",
  ],
  nextNodeId: "day_0_training_2_ending", 
},
day_0_training_2_ending: {
  id: "day_0_training_2_ending",
  sceneId: "tennis_court_night",
  text: [
    "就這樣...第一天練球結束了。",
    "明天一定也要繼續加油(握拳)",
  ],
  nextNodeId: "day_0_training_2_ending_1", 
},
day_0_training_2_ending_1: {
  id: "day_0_training_2_ending_1",
  sceneId: "tennis_court_night",
  text: "",
  nodeType: "eventTitle",
  eventTitleText: "第一天結束了",
  effects: effects(advanceToNextDay()),
  nextNodeId: "day_1_0",
},

day_1_0: {
  id: "day_1_0",
  sceneId: "school_gate",
  text: ["好累喔，昨天忘了收操...",
  ],
  nextNodeId: "day_1_1",
},

day_1_1: {
  id: "day_1_1",
  sceneId: "school_gate",
  text: 
    "今天要先去做什麼呢？",
  choices: [
    {
      text: "去跟圖書館交往",
      nextStoryNodeId: "day_1_1_1",
    },
    {
      text: "去網球場練球",
      nextStoryNodeId: "day_1_1_2",
    },
    {
      text: "去烏龜池看書",
      nextStoryNodeId: "day_1_1_3",
    },
  ],
},
day_1_1_1: {
  id: "day_1_1_1",
  sceneId: "library",
  text: ["(到了圖書館)",
    "「還是圖書館適合我，網球隊男生都怪怪的。」",
    "「來準備一下作業吧!」",
    "(很久以後)",
    "「天色不早了，該去練球了!」",
  ],
  nextNodeId: "day_1_2",
},
day_1_1_2: {
  id: "day_1_1_2",
  sceneId: "tennis_court_day",
  text: ["(到了網球場)",
    "「ㄟ怎麼一個人都沒有....看來大家也不怎麼認真。」",
    "(看向角落)",
    "「靠北...那個什麼家哥怎麼還蹲在那。」",
    "(很久以後)",
    "「天色不早了，該去練球了!」",
  ],
  nextNodeId: "day_1_2",
},
day_1_1_3: {
  id: "day_1_1_3",
  sceneId: "lake",
  text: ["(到了烏龜池)",
    "「挖這裡很舒服耶。」",
    "「(找地方坐下)",
    "「(滴到鳥屎)",
    "「你媽的」",
    "(很久以後)",
    "「天色不早了，該去練球了!」",
  ],
  nextNodeId: "day_1_2",
},
day_1_2: {
  id: "day_1_2",
  sceneId: "tennis_court_night",
  text: ["(到了網球場)",
  ],
  nextNodeId: "day_1_3",
},


day_1_3: {
  id: "day_1_3",
  sceneId: "tennis_court_night",
  characterId: "senpai_A",
  spriteExpression: "default",
  text: [
    "Yooooo，肉泥你來了。",
    "「隊...隊長好！」",
    "你有記得要看一下手機的網球隊共用行事曆歐，明天就是迎新活動了。",
    "按照慣例新生都要準備一首歌。",
    "「蛤!!!好...好的隊長。」",
  ],
  nextNodeId: "day_1_4",
},


day_1_4: {
  id: "day_1_4",
  sceneId: "tennis_court_night",
  characterId: "classmate_yue",
  spriteExpression: "default",
  text: [
    "欸要熱身嗎？",
    "「這個人感覺很強...」",
    "不要這樣看我，我會陽痿。",
    "「媽的...」",
  ],
  effects: effects(setMetCharacter("classmate_yue")),
  nextNodeId: "day_1_5",
},
day_1_5: {
  id: "day_1_5",
  sceneId: "tennis_court_night",
  text: [
    "(打了一陣子後...)",
  ],
  nextNodeId: "day_1_6",
},
day_1_6: {
  id: "day_1_6",
  sceneId: "tennis_court_night",
  characterId: "classmate_yue",
  spriteExpression: "default",
  text: [
    "欸你認識家哥哥嗎？",
    "「你是說在黑暗角落發爛的那個嗎？」",
    "對阿，我來介紹給你認識。",
    "「真的嗎？」(有點害怕)",
  ],
  nextNodeId: "day_1_7",
},
day_1_7: {
  id: "day_1_7",
  sceneId: "tennis_court_night",
  text: [
    "(兩人一起走向角落)",
  ],
  nextNodeId: "day_1_8",
},
day_1_8: {
  id: "day_1_8",
  sceneId: "tennis_court_night",
  characterId: "classmate_yue",
  spriteExpression: "default",
  text: [
    "家~~哥~~哥~~( శ 3ੜ)～♥",
  ],
  nextNodeId: "day_1_8_1",
},
day_1_8_1: {
  id: "day_1_8_1",
  sceneId: "tennis_court_night",
  characterId: "classmate_old",
  spriteExpression: "default",
  text: [
    "嗨寶貝(拍屁股練正拍)",
    "(三小...)",
    "你就是肉泥嗎？",
    "「對，學長好」",
    "你有被光速踢過嗎？",
    "「蛤？」",
    "如果有這樣的男友你會幾點回家？",
    "「蛤？」",
    "欸對了學妹，現在是幾月了？",
    "「現在已經是2月了。」",
    "阿那是時候準備大專盃了，今年一定要拿到冠軍。",
    "(老不死的家哥慢慢淡化消失在黑暗裡)",
    "(...)",
  ],
  effects: effects(setMetCharacter("classmate_old")),
  nextNodeId: "day_1_8_2",
},

day_1_8_2: {
  id: "day_1_8_2",
  sceneId: "tennis_court_night",
  characterId: "classmate_yue",
  spriteExpression: "default",
  text: [
    "很酷吧這個就是家哥。",
    "「家哥是活人嗎？」",
    "其實沒有人知道，目前唯一的線索是只要接近大專盃，他就會慢慢浮現。",
    "「好...好的。」",
  ],
  nextNodeId: "day_1_9",
},
day_1_9: {
  id: "day_1_9",
  sceneId: "tennis_court_night",
  characterId: "coach",
  spriteExpression: "default",
  text: [
    "集合了各位，你去帶收操，我就先走了黑。",
    "(教練飛奔消失)",
  ],
  nextNodeId: "day_1_9_1",
},
day_1_9_1: {
  id: "day_1_9_1",
  sceneId: "tennis_court_night",
  text: [
    "(一溜煙教練就跑了，這真的是網球隊嗎？)",
  ],
  nextNodeId: "day_1_9_2",
},
day_1_9_2: {
  id: "day_1_9_2",
  sceneId: "tennis_court_night",
  characterId: "classmate_ma",
  spriteExpression: "default",
  text: [
    "欸來收操了。",
    "(看向負責帶操的隊員)",
    "看屁喔。",
    "(...)",
  ],
  nextNodeId: "day_1_9_3",
},

day_1_9_3: {
  id: "day_1_9_3",
  sceneId: "tennis_court_night",
  characterId: "classmate_yue",
  spriteExpression: "default",
  text: [
    "這個人是麻大哥，沒有人敢惹他，你小心不要喵到他。",
    "「黑...黑社會嗎？」",
    "沒有他只是暗戀旁邊那個高高的女生所以常常很害羞。",
    "(遠處傳來) 靠北歐？",
    "「被他聽到了!! 不過他臉還真紅，紅到耳朵去了。」",
  ],
  nextNodeId: "day_1_ending",
  effects: effects(setMetCharacter("classmate_ma")),
},


day_1_ending: {
  id: "day_1_ending",
  sceneId: "tennis_court_night",
  text: [
    "就這樣...第二天練球結束了。",
    "今天要早點回去練習唱歌耶，不知道明天迎新能不能很順利...",
  ],
  nextNodeId: "day_1_ending_1", 
},
day_1_ending_1: {
  id: "day_1_ending_1",
  sceneId: "tennis_court_night",
  text: "",
  nodeType: "eventTitle",
  eventTitleText: "第二天結束了",
  effects: effects(advanceToNextDay()),
  nextNodeId: "day_2_0",
},

day_2_0: {
  id: "day_2_0",
  sceneId: "school_gate",
  text: ["今天感覺好一點了",
    "差點忘記!!晚上要迎新，好緊張QvQ",
  ],
  nextNodeId: "day_2_1",
},

day_2_1: {
  id: "day_2_1",
  sceneId: "school_gate",
  text: 
    "我要唱什麼歌才好呢",
  choices: [
    {
      text: "大展鴻圖 (攬老)",
      nextStoryNodeId: "day_2_1_1",
    },
    {
      text: "愚者 (理想混蛋)",
      nextStoryNodeId: "day_2_1_2",
    },
    {
      text: "Supernova (Aespa)",
      nextStoryNodeId: "day_2_1_3",
    },
  ],
},

day_2_1_2: {
  id: "day_2_1_2",
  sceneId: "school_gate",
  text: [
    "旅行的起點不需要形狀🎵",
    "只要心已經開始流浪🎵🎵",
    "我唱的還真好ㄟ。",
    "(遠處傳來)欸欸理想智障。",
  ],
  nextNodeId: "day_2_1_2_1",
},
day_2_1_2_1: {
  id: "day_2_1_2_1",
  sceneId: "school_gate",
  characterId: "classmate_yu",
  spriteExpression: "default",
  text: [
    "欸你在唱理想智障的歌歐？",
    "「理想混蛋拉!我要跟你絕交。」",
    "只好把你逐出師門了。",
  ],
  effects: effects(increaseAffection("classmate_yu", 10)),
  nextNodeId: "day_2_1_0",
},
day_2_1_1: {
  id: "day_2_1_1",
  sceneId: "school_gate",
  text: [
    "别墅里面唱k🎵...水池里面银龙鱼🎵",
    "大展鸿图大师亲手提笔字🎵",
    "大展鸿图搬来放在办公室🎵",
    "「握曹這歌曲越唱越上頭耶，我真是有品味。",
    "(遠處傳來)大展鸿图关公都点头(有料)",
  ],
  nextNodeId: "day_2_1_1_1",
},
day_2_1_3: {
  id: "day_2_1_3",
  sceneId: "school_gate",
  text: [
    "거세게 커져가, ah-oh, ayy🎵",
    "That tick, that tick, tick bomb🎵",
    "(遠處傳來)Nova, can't stop hyperstellar",
  ],
  nextNodeId: "day_2_1_3_1",
},
day_2_1_3_1: {
  id: "day_2_1_3_1",
  sceneId: "school_gate",
  characterId: "classmate_wu",
  spriteExpression: "default",
  text: [
    "사건은 다가와, ah-oh, ayy",
    "你還蠻會唱的欸。",
    "什麼你問我解析度怎麼那麼低？",
    "因為CharGPT的記憶跑掉了，我就靠北變這樣了，但算了。",
    "(蛤...)",
    "就這樣了，보이지 않는 힘으로 네게 손 내밀어 볼까",
  ],
  effects: effects(setMetCharacter("classmate_wu")),
  nextNodeId: "day_2_1_0",
},
day_2_1_1_1: {
  id: "day_2_1_1_1",
  sceneId: "school_gate",
  characterId: "classmate_ma",
  spriteExpression: "default",
  text: [
    "想不到你還挺有品味的。",
    "得罪小人没关系 得罪君子我看不起。",
    "「世上君子不贪杯」",
    "等于得罪了道(对)",
  ],
  effects: effects(increaseAffection("classmate_ma", 10)),
  nextNodeId: "day_2_1_0",
},

day_2_1_0: {
  id: "day_2_1_0",
  sceneId: "school_gate",
  text: 
    "再來試試看別的歌嗎？",
  choices: [
    {
      text: "大展鴻圖 (攬老)",
      nextStoryNodeId: "day_2_1_1",
    },
    {
      text: "愚者 (理想混蛋)",
      nextStoryNodeId: "day_2_1_2",
    },
    {
      text: "Supernova (Aespa)",
      nextStoryNodeId: "day_2_1_3",
    },
    {
      text: "不唱了，準備出發迎新。",
      nextStoryNodeId: "day_2_2",
    },
  ],
},
day_2_2: {
  id: "day_2_2",
  sceneId: "school_gate",
  text: [
    "「迎新好像是要去景美的好樂迪。」",
    "「時間也差不多了，先來等公車好了。」",],
    nextNodeId: "day_2_3",
},

day_2_3: {
  id: "day_2_3",
  sceneId: "school_gate",
  characterId: "classmate_yu",
  spriteExpression: "default",
  text: [
    "嗨~~你也要去迎新嗎？",
    "「對呀，正在等公車。」",
  ],
  nextNodeId: "day_2_3_1",
},
day_2_3_1: {
  id: "day_2_3_1",
  sceneId: "school_gate",
  text: 
  "可憐阿沒人載妳喔？",
  choices: [
    {
      text: "關你什麼事情？",
      nextStoryNodeId: "day_2_3_1_1",
    },
    {
      text: "對阿，只能等公車。",
      nextStoryNodeId: "day_2_3_1_2",
    },
    {
      text: "還是你載我去？",
      nextStoryNodeId: "day_2_3_1_3",
    },
  ],
},

day_2_3_1_1: {
  id: "day_2_3_1_1",
  sceneId: "school_gate",
  text: [
    "(公車來了...)",
    "你上了公車，不甩那個沒禮貌的同學。",
    "「現在的男生是覺得這樣把妹很帥是不是....」(傻眼)",
  ],
  effects: effects(increaseAffection("classmate_yu", -5)),
  nextNodeId: "day_2_4",
},
day_2_3_1_2: {
  id: "day_2_3_1_2",
  sceneId: "school_gate",
  characterId: "classmate_yu",
  spriteExpression: "default",
  text: [
    "是歐，那我們一起等吧。",
    "「可以呀。」",
    "跟你說喔，你有沒有看過我的混雙搭檔。",
    "「我不認識耶，我才剛進來網球隊。」",
    "可惜了，不然真想介紹給你認識看看。他超可愛啦>/////<",
    "(這人怎麼這麼反差)",
    "「那你怎麼不追他？」",
    "(馮同學一言不發，看向了遠方的夕陽。)",
    "這是一場激烈的戰爭。",
    "(...感覺很複雜，還是等跟他熟一點再問好了。)",
  ],
  effects: effects(increaseAffection("classmate_yu", 10)),
  nextNodeId: "day_2_4",
},
day_2_3_1_3: {
  id: "day_2_3_1_3",
  sceneId: "school_gate",
  characterId: "classmate_yu",
  spriteExpression: "default",
  text: [
    "你腳斷了喔？",
    "(......)",
    "(公車來了...)",
    "你上了公車，不甩那個沒禮貌的同學。",
    "「現在的男生是覺得這樣把妹很帥是不是....」(傻眼)",
  ],
  effects: effects(increaseAffection("classmate_yu", 10)),
  nextNodeId: "day_2_4",
},
day_2_4: {
  id: "day_2_4",
  sceneId: "ktv",
  text: [
    "(到了KTV)",
    "大家都已經到了，你很尷尬的推開了門走進去",
  ],
  nextNodeId: "day_2_5",
},
day_2_5: {
  id: "day_2_5",
  sceneId: "ktv",
  characterId: "coach",
  spriteExpression: "default",
  text: [
    "這麼晚來，先罰三杯。欸拿酒給他。",
    "「真的嗎？沒事我超勇的拉，我超會喝。我是車輪戰型選手。」",
    "(完蛋了我通常喝一口就倒在地上吐了...)",
  ],
  nextNodeId: "day_2_6",
},
day_2_6: {
  id: "day_2_6",
  sceneId: "ktv",
  characterId: "senpai_A",
  spriteExpression: "default",
  text: [
    "教練沒關係啦，我先幫她喝一杯。",
    "「真的嗎隊長？」",
    "當然囉，我喝不醉的。",
  ],
  nextNodeId: "day_2_6_1",
},
day_2_6_1: {
  id: "day_2_6_1",
  sceneId: "ktv",
  characterId: "coach",
  spriteExpression: "default",
  text: [
    "欸那個女生，來陪我喝酒。",
    "某人：「不要拉教練，我不會喝酒。」",
    "欸快點去叫她過來喝拉。",
    "某人：(微笑不說話。)",
  ],
  nextNodeId: "day_2_6_2",
},

day_2_6_2: {
  id: "day_2_6_2",
  sceneId: "ktv",
  characterId: "senpai_A",
  spriteExpression: "default",
  text: [
    "我想去透透氣。",
    "(隊長開車離開)",
  ],
  nextNodeId: "day_2_6_3",
},
day_2_6_3: {
  id: "day_2_6_3",
  sceneId: "ktv",
  text: [
    "(...現在什麼情況)",
    "某人：「現在要怎麼處理(氣嘟嘟)」",
    "某人：「重點是他喝酒阿(氣嘟嘟)」",
    "(KTV的黑暗角落有個人影慢慢浮現)",
  ],
  nextNodeId: "day_2_6_4",
},
day_2_6_4: {
  id: "day_2_6_4",
  sceneId: "ktv",
  characterId: "classmate_old",
  spriteExpression: "default",
  text: [
    "兇什麼兇阿!!!",
    "(丟水瓶)",
    "真相只有一個!!!",
    "(消失在黑暗的角落)",
  ],
  nextNodeId: "test",
},
test: {
  id: "test",
  sceneId: "school",
  text: [
    "試玩版本到此結束。",
  ],
  nextNodeId: "test",
},


  final_day_checkpoint: {
    id: "final_day_checkpoint",
    sceneId: "school_gate", // Example scene
    text: "時間過得真快，大學生活似乎即將迎來一個結果...",
    effects: effects(
      determineAndTriggerEnding() // Call the ending determination logic
    ),
    // No nextNodeId here, the effect handles the state change
    nextNodeId: undefined,
  },
};
