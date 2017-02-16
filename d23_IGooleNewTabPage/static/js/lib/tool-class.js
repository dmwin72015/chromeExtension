/**
 * Created by mjj on 17/1/24.
 */
define('lib:toolClass', function(require, exports, module) {

    function hasClass(obj, sClass) {
        return obj.classList.contains(sClass);
    }

    function removeClass(obj, sClass) {
        obj.classList.remove(sClass);
        return obj;
    }

    function addClass(obj, sClass) {
        obj.classList.add(sClass);
        return obj;
    }

    //1485156522281
    function toggleClass(obj, sClass) {
        if (hasClass(obj, sClass)) {
            removeClass(obj, sClass)
        } else {
            addClass(obj, sClass);
        }
    }

    function hightSelf(obj, sClass, reverse) {
        var oParent = obj.parentNode;
        for (var i = 0; i < oParent.children.length; i++) {
            var flag = reverse ? (oParent.children[i] != obj) : (oParent.children[i] == obj);
            if (flag) {
                addClass(oParent.children[i], sClass)
            } else {
                removeClass(oParent.children[i], sClass);
            }
        }
    }

    function UUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0,
                v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    function getRandomNum(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    module.exports = {
        hasClass: hasClass,
        addClass: addClass,
        removeClass: removeClass,
        toggleClass: toggleClass,
        hightSelf: hightSelf,
        UUID: UUID,
        randomInt: getRandomNum
    }
});
