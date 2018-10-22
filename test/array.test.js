const { describe, it } = require('mocha')
const { objectArrayFind, ObjectId } = require('..')
const asset = require('assert')

const data = [
  { _id: ObjectId.newString(), name: '45666', age: 18 },
  { _id: ObjectId.newString(), name: '153', age: 18 },
  { _id: ObjectId.newString(), name: '153', age: 17 },
  { _id: ObjectId.newString(), name: '87156', age: 15 },
  { _id: ObjectId.newString(), name: '12313223', age: 16 },
  { _id: ObjectId.newString(), name: '4565', age: 15 },
  { _id: ObjectId.newString(), name: '666', age: 14 },
  { _id: ObjectId.newString(), name: '6', age: 14 },
]

describe('objectArrayFind()', () => {
  it('# objectArrayFind() &&', function () {
    const result = objectArrayFind(data, { age: 14, name: '666' })
    console.log(result)
    for (let i = 0; i < result.length; i++) {
      const element = result[i];
      asset.strictEqual(element.age, 14)
      asset.strictEqual(element.name, '666')
    }
  })

  it('# objectArrayFind() $or1', function () {
    const result = objectArrayFind(data, { $or: [{age: 15}, {name: '666'}] })
    console.log(result)
    for (let i = 0; i < result.length; i++) {
      const element = result[i];
      asset.ok(element.name === '666' || element.age === 15)
    }
  })

  it('# objectArrayFind() $or2', function () {
    const result = objectArrayFind(data, { $or: [{age: 15, name: '87156'}, {age: 14}] })
    console.log(result)
    for (let i = 0; i < result.length; i++) {
      const element = result[i];
      asset.ok(element.age === 14 || element.age === 15)
    }
  })

  it('# objectArrayFind() complex', function () {
    const result = objectArrayFind(data, { name: '6', $or: [{age: { $gte: 17 }, name: '153'}, {age: 14}] })
    console.log(result)
    asset.strictEqual(result.length, 1)
  })

  it('# objectArrayFind() $in', function () {
    const result = objectArrayFind(data, { name: { $in: ["666", "4444444", "12313223"] }, age: { $lt: 17 } })
    console.log(result)
    for (let i = 0; i < result.length; i++) {
      const element = result[i];
      asset.ok(["666", "4444444", "12313223"].indexOf(element.name) !== -1 && element.age < 17)
    }
  })

  it('# objectArrayFind() function', function () {
    const result = objectArrayFind(data, { age: (v) => v >= 15, name: (v) => v.length < 5 })
    console.log(result)
    for (let i = 0; i < result.length; i++) {
      const element = result[i];
      asset.ok(element.age >= 15 && element.name.length < 5)
    }
  })

  it('# objectArrayFind() {and}', function () {
    const result = objectArrayFind(data, { age: { $lt: 18, $gt: 14 } })
    console.log(result)
    for (let i = 0; i < result.length; i++) {
      const element = result[i];
      asset.ok(element.age < 18 && element.age > 14)
    }
  })

  it('# objectArrayFind() {$or}', function () {
    const result = objectArrayFind(data, { age: { $or: [{ $lt: 16 }, { $gt: 17 }] } })
    console.log(result)
    for (let i = 0; i < result.length; i++) {
      const element = result[i];
      asset.ok(element.age < 16 || element.age > 17)
    }
  })
})