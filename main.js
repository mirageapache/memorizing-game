// 會使用MVC架構將程式碼模組化

// Declarative(宣告) =======================
// 卡牌圖示
const symbols = [
  'https://assets-lighthouse.alphacamp.co/uploads/image/file/17989/__.png', // 黑桃
  'https://assets-lighthouse.alphacamp.co/uploads/image/file/17992/heart.png', // 愛心
  'https://assets-lighthouse.alphacamp.co/uploads/image/file/17991/diamonds.png', // 方塊
  'https://assets-lighthouse.alphacamp.co/uploads/image/file/17988/__.png' // 梅花
]

// 遊戲狀態
const GAME_STATE = {
  FirstCardAwaits: "FirstCardAwaits", //等待翻第一張牌
  SecondCardAwaits: "SecondCardAwaits", //等待翻第二張牌
  CardsMatchFailed: "CardsMatchFailed", //卡牌配對失敗
  CardsMatched: "CardsMatched", //卡牌配對成功
  GameFinished: "GameFinished", //遊戲結束
}

// View(介面) =======================
const view = {
  // 取得卡牌，預設為蓋牌狀態
  getCardElement(index){
    return `
    <div class="card back" data-index="${index}"></div>
    `
  },

  //取得卡牌內元素
  getCardContent(index){
    const number = this.transformNumber((index%13)+1) //卡牌數字
    const symbol = symbols[Math.floor(index / 13)] //卡牌圖示

    return `
      <p>${number}</p>
      <img src="${symbol}">
      <p>${number}</p>
    `
  },

  // 顯示初始產生的卡牌
  displayCard(indexes){
    const rootElement = document.querySelector('#cards')
    rootElement.innerHTML = indexes.map(index => this.getCardElement(index)).join("")
  },

  // 翻轉卡牌
  flipCards(...cards){ //用展開運算子「...」將傳入的參數變成陣列
    cards.map(card => { //再用.map()來執行翻牌動作
      // 如果是背面(back)就轉正面(取得卡片數字及花色)
      if(card.classList.contains('back')){
        card.classList.remove('back')
        card.innerHTML = this.getCardContent(card.dataset.index) 
        return
      }

      // 如果是正面就蓋牌
      card.classList.add('back')
      card.innerHTML = null
    })
  },

  // 特殊數字轉換 [1,11,12,13的卡牌要換成A,J,Q,K]
  transformNumber(number){
    switch(number){
      case 1:
        return 'A'
      case 11:
        return 'J'
      case 12:
        return 'Q'
      case 13:
        return 'K'
      default:
        return number
    }
  },

  // 反灰卡牌 (改變配對成功牌組的樣式)
  pairCards(...cards){
    cards.map(card => {
      card.classList.add('paired')
    })
  }

}

// Controller(控制器) =======================
const controller = {
  currentState: GAME_STATE.FirstCardAwaits,
  
  // 初始化產生卡牌
  generateCards(){
    view.displayCard(utility.getRandomNubmerArray(52))
  },

  // 管理及觸發遊戲狀態(進度) 
  dispatchCardAction(card){
    if(!card.classList.contains('back')){
      return
    }

    switch (this.currentState){
      case GAME_STATE.FirstCardAwaits:
        view.flipCards(card) //翻牌
        model.revealedCards.push(card) //暫存到陣列
        this.currentState = GAME_STATE.SecondCardAwaits //更新遊戲狀態(推進到SecondCardAwaits)
        break
      case GAME_STATE.SecondCardAwaits:
        view.flipCards(card) 
        model.revealedCards.push(card)

        if(model.isReaveledCardsMatched()){
          // 配對成功
          this.currentState = GAME_STATE.CardsMatched //更新遊戲狀態(推進到CardsMatched)
          view.pairCards(...model.revealedCards) //將牌組反灰
          model.revealedCards = [] //清除暫存陣列
          this.currentState = GAME_STATE.FirstCardAwaits //更新遊戲狀態(回到FirstCardAwaits)
        }
        else{
          // 配對失敗
          this.currentState = GAME_STATE.CardsMatchFailed //更新遊戲狀態(推進到CardsMatchFailed)
          setTimeout(this.resetCard, 1000);
        }
        break
    }

    // console.log('current state', this.currentState)
    // console.log('revealed Card', model.revealedCards)
  },

  // 蓋牌動作
  resetCard(){
    console.log('reset')
    view.flipCards(...model.revealedCards) //覆蓋卡牌
    model.revealedCards = [] //清除暫存陣列
    controller.currentState = GAME_STATE.FirstCardAwaits //更新遊戲狀態(回到FirstCardAwaits)
  }
}

// Model(資料) =======================
const model = {
  revealedCards: [],  //記錄被翻開的卡牌
  
  // 合對卡牌 (判斷翻開的兩張卡牌是否一樣)
  isReaveledCardsMatched(){
     return this.revealedCards[0].dataset.index % 13 === this.revealedCards[1].dataset.index % 13
  }
}


// Utility(外掛函式) =======================
const utility = {
  // 隨機重組數字(洗牌演算法：Fisher-Yates Shuffle)
  getRandomNubmerArray(count){
    const number = Array.from(Array(count).keys())
    for(let index = number.length-1; index > 0; index--){
      let random_index = Math.floor(Math.random() * (index + 1))
      ;[number[index], number[random_index]] = [number[random_index], number[index]]
    }
    return number
  }

}


// Execute(執行) =======================

//初始化產生卡牌
controller.generateCards()

//監聽卡牌點擊
document.querySelectorAll('.card').forEach(card => {
  card.addEventListener('click', event => {
    controller.dispatchCardAction(card)
  })
})

