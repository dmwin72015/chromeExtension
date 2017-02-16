/**
 * Created by mjj on 17/1/22.
 */
chrome.system.cpu.getInfo(function (cpu) {
    console.log(cpu);
});

chrome.system.memory.getInfo(function (memory) {
    console.log(memory);
});

chrome.system.storage.getInfo(function (storage) {
    console.log(storage);

});