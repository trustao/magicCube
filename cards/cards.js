(function (win) {
    win.cardInit = cardInit
    function cardInit (options) {
        return new Cards(options)
    }

    function Cards(options) {
        this.options = options || {}
        this.cards = []
        this.selectedCount = this.options.selectedCount || 4
        this.animationType = this.options.animationType || 'random'
        this.frontContent = this.options.frontContent
        this.backContent = this.options.backContent
        this.endCallBack = null
        this.startCallBack = null
        this.el = document.querySelector(this.options.el)
        this.speed = this.options.speed || 1
        this.time = this.options.time || 3000
        this.defaultStyle = {
            wrap: {
                width: '80vw',
                height: '80vw',
                border: '4px solid rgb(76, 79, 255)',
                borderRadius: '4px',
                background: 'rgb(76, 79, 255)',
                margin: '0 auto',
                display: 'flex',
                flexWrap: 'wrap',
                flexDirection: 'row',
                justifyContent: 'space-around',
                alignItems: 'center'
            },
            card: {
                position: 'relative',
                width: '14vw',
                height: '18vw',
                transformStyle: 'preserve-3d'
            },
            cardCommon:{
                position: 'absolute',
                top:0,
                left: 0,
                width: '100%',
                height: '100%',
                backfaceVisibility: 'hidden',
                transition: ' transform .5s ease',
                overflow: 'hidden',
                textAlign: 'center'
            },
            front: {
                background: 'rgb(173, 239, 255)',
                transform: 'rotateY(0deg)'
            },
            back: {
                background: 'rgb(255, 106, 138)',
                transform: 'rotateY(180deg)'
            },
            active: {
                boxShadow: '0 0 8px 2px rgb(255, 251, 12)'
            },
            rotation: {

            }
        }
        this.init()
        this.styleInit(this.options.style || {})
    }

    Cards.prototype.init = function () {
        var cards = this.cards
        var wrap = document.createElement('div')
        wrap.className = 't-card-wrap'
        for(var i=0; i< 20; i++) {
            var cardItem = document.createElement('div')
            cardItem.className = 't-card-item'
            cardItem.innerHTML = '<div class="t-card-front">'
                + ((typeof this.frontContent === 'string') ? this.frontContent : '')
                + '</div><div class="t-card-back">'
                + ((typeof this.backContent === 'string') ? this.backContent : '')
                +'</div>'
            wrap.appendChild(cardItem)
            cards.push(cardItem);
        }
        if (this.el) {
            this.el.appendChild(wrap)
        } else {
            console.error('You need an element as a vector！')
        }
    }
    Cards.prototype.styleInit = function (styleData) {
        var styles = JSON.parse(JSON.stringify(this.defaultStyle))
        for (var key in styleData) {
            if (typeof styleData[key] !== 'object') {
                return
            }
            Object.assign(styles[key], styleData[key])
        }
        var styleDom = document.createElement('style')
        var styleText = '.t-card-wrap {' + objectToCss(styles.wrap) + '} '
            + '.t-card-wrap .t-card-item{' + objectToCss(styles.card) + '} '
            + '.t-card-wrap .t-card-item>div{' + objectToCss(styles.cardCommon) + '} '
            + '.t-card-wrap .t-card-item .t-card-front{' + objectToCss(styles.front) + '} '
            + '.t-card-wrap .t-card-item .t-card-back{' + objectToCss(styles.back) + '} '
            + ' .t-card-wrap .t-card-item.rotate .t-card-front{  transform: rotateY(180deg);} '
            + ' .t-card-wrap .t-card-item.rotate .t-card-back{  transform: rotateY(0deg);} '
            + '.t-card-wrap .t-card-item.active>div{' + objectToCss(styles.active) + '} '
        styleDom.innerText = styleText
        document.head.appendChild(styleDom)
    }
    Cards.prototype.startAnimate = function() {
        this.cards.forEach(function (card) {
            removeClass(card, 'rotate')
        })
        if (this.animationType === 'random' ){
            this.randomChange()
        } else if (this.animationType === 'sequent') {
            this.sequentialChange()
        } else {
            console.error('Unknown animationType！It can only be "random" or "sequent".')
        }
    }
    Cards.prototype.sequentialChange = function () {
        if (this.animationStatus) {
            return
        }
        typeof this.startCallBack === 'function' && this.startCallBack()
        this.animationStatus = true
        var me = this
        var max = Math.round(me.speed * 19 * 5 + Math.random()*19)
        var b=0,c=this.time,d=max,t=0;
        for(; t < d; t ++) {
            (function(t) {
                setTimeout(function () {
                    me.addActive([t%20])
                    if (t == d - 1) {
                        me.endAnimation([t%20])
                    }
                },Cubic.easeIn(t,b,c,d))
            })(t)
        }
    }
    Cards.prototype.randomChange = function () {
        if (this.animationStatus) {
            return
        }
        typeof this.startCallBack === 'function' && this.startCallBack()
        this.animationStatus = true
        var me = this
        var max = me.speed * (me.time / 100)
        var b=0,c=this.time,d=max,t=0;
        for(; t < d; t ++) {
            (function(t) {
                setTimeout(function () {
                    var selectedCards = getRandomElements(19, me.selectedCount)
                    me.addActive(selectedCards)
                    if (t == d - 1) {
                        me.endAnimation(selectedCards)
                    }
                },Cubic.easeIn(t,b,c,d))
            })(t)
        }
    }
    Cards.prototype.endAnimation = function (selectedCards) {
        var backs = []
        this.selected = this.cards.filter(function (card, index) {
            if (selectedCards.indexOf(index) >= 0 ) {
                toggleClass(card, 'rotate')
                backs.push(card.querySelector('.t-card-back'))
                return true
            } else {
                return false
            }
        })
        this.animationStatus = false
        typeof this.endCallBack === 'function' && this.endCallBack(backs, this.selected)
    }
    Cards.prototype.addActive = function (selectedCards) {
        this.cards.forEach(function (el, index) {
            if (selectedCards.indexOf(index) < 0) {
                removeClass(el, 'active')
            } else {
                addClass(el, 'active')
            }
        })
    }

    function objectToCss (data) {
        var text = ''
        if (typeof data === 'object') {
            for(var attr in data) {
                text += attr.replace(/([A-Z]{1})/g, function ($0, $1, index) {
                        if (index>0) {
                            return '-' + $1.toLowerCase()
                        } else {
                            return $1.toLowerCase()
                        }
                    }) + ':' + data[attr] + ';'
            }
        } else {
            text = ''
        }
        return text
    }

    function toggleClass(element, className){
        var classList = element.className
        if (classList.indexOf(className) < 0 ){
            element.className = classList + ' ' + className
        } else {
            element.className = classList.replace(className, '').trim()
        }
    }

    function addClass(element, className) {
        var classList = element.className
        if (classList.indexOf(className) < 0 ){
            element.className = classList + ' ' + className
        }
    }

    function removeClass(element, className) {
        var classList = element.className
        if (classList.indexOf(className) >= 0 ){
            element.className = classList.replace(className, '').trim()
        }
    }

    function getRandomElements(max, count) {
        var arr = []
        for(var i = 0; i< count; i++){
            var num = Math.round(Math.random()*max)
            if(arr.indexOf(num) < 0) {
                arr.push(num)
            }else {
                i--
            }
        }
        return arr
    }

    var Cubic = {
        easeIn: function(t,b,c,d){
            return c*(t/=d)*t*t + b;
        },
        easeOut: function(t,b,c,d){
            return c*((t=t/d-1)*t*t + 1) + b;
        },
        easeInOut: function(t,b,c,d){
            if ((t/=d/2) < 1) return c/2*t*t*t + b;
            return c/2*((t-=2)*t*t + 2) + b;
        }
    }

})(window)