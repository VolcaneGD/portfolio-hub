const { test } = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
function setup(count) {
  const element = () => ({ hidden:false, disabled:false, textContent:'', classList:{add(){}}, setAttribute(){}, addEventListener(name, fn){this[name]=fn;} });
  const items = Array.from({length:count}, element);
  const ids = Object.fromEntries(['updates-toggle','updates-previous','updates-next','updates-pagination','updates-status'].map(id=>[id,element()]));
  ids.updates = {querySelectorAll:()=>items,scrollIntoView(){}};
  vm.runInNewContext(fs.readFileSync('source/public/updates.js','utf8'), {document:{getElementById:id=>ids[id]}});
  return {items,ids,visible:()=>items.filter(i=>!i.hidden).length};
}
test('latest five, expanded twenty, remainder and collapse reset',()=>{
  const s=setup(46);
  assert.equal(s.visible(),5);
  s.ids['updates-toggle'].click(); assert.equal(s.visible(),20);
  s.ids['updates-next'].click(); assert.equal(s.visible(),20);
  assert.equal(s.items[20].hidden,false); assert.equal(s.items[19].hidden,true);
  s.ids['updates-next'].click(); assert.equal(s.visible(),6); assert.equal(s.ids['updates-next'].disabled,true);
  s.ids['updates-previous'].click(); assert.equal(s.visible(),20);
  s.ids['updates-toggle'].click(); assert.equal(s.visible(),5);
  s.ids['updates-toggle'].click(); assert.equal(s.items[0].hidden,false);
});
test('five or fewer entries need no toggle or pagination',()=>{
  const s=setup(4);assert.equal(s.visible(),4);assert.equal(s.ids['updates-toggle'].hidden,true);assert.equal(s.ids['updates-pagination'].hidden,true);
});
