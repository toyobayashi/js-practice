const { describe, it } = require('mocha')
const { objectArrayFind, ObjectId } = require('..')
const asset = require('assert')

describe('Comparison Query Operators', () => {
  const data = [
    { "_id": ObjectId.newString("4fb4af85afa87dc1bed94330"), "age": 7, "length_1": 30 },
    { "_id": ObjectId.newString("4fb4af89afa87dc1bed94331"), "age": 8, "length_1": 30 },
    { "_id": ObjectId.newString("4fb4af8cafa87dc1bed94332"), "age": 6, "length_1": 30 }
  ]
  it('# $lte', function () {
    const result = objectArrayFind(data, { age: { $lte: 7 } })
    console.log(result)
    for (let i = 0; i < result.length; i++) {
      const element = result[i];
      asset.ok(element.age <= 7)
    }
    asset.equal(result.length, 2)
  })

  it('# $lt', function () {
    const result = objectArrayFind(data, { age: { $lt: 8 } })
    console.log(result)
    for (let i = 0; i < result.length; i++) {
      const element = result[i];
      asset.ok(element.age < 8)
    }
    asset.equal(result.length, 2)
  })

  it('# $gte', function () {
    const result = objectArrayFind(data, { age: { $gte: 7 } })
    console.log(result)
    for (let i = 0; i < result.length; i++) {
      const element = result[i];
      asset.ok(element.age >= 7)
    }
    asset.equal(result.length, 2)
  })

  it('# $gt', function () {
    const result = objectArrayFind(data, { age: { $gt: 6 } })
    console.log(result)
    for (let i = 0; i < result.length; i++) {
      const element = result[i];
      asset.ok(element.age > 6)
    }
    asset.equal(result.length, 2)
  })

  it('# $eq', function () {
    const result = objectArrayFind(data, { age: { $eq: 7 } })
    console.log(result)
    for (let i = 0; i < result.length; i++) {
      const element = result[i];
      asset.ok(element.age === 7)
    }
    asset.equal(result.length, 1)
  })

  it('# $ne', function () {
    const result = objectArrayFind(data, { age: { $ne: 7 } })
    console.log(result)
    for (let i = 0; i < result.length; i++) {
      const element = result[i];
      asset.ok(element.age !== 7)
    }
    asset.equal(result.length, 2)
  })

  it('# $in', function () {
    const result = objectArrayFind(data, { age: { $in: [7, 8] } })
    console.log(result)
    for (let i = 0; i < result.length; i++) {
      const element = result[i];
      asset.ok(element.age === 7 || element.age === 8)
    }
    asset.equal(result.length, 2)
  })

  it('# $nin', function () {

    const result = objectArrayFind(data, { age: { $nin: [7, 8] } })
    console.log(result)
    for (let i = 0; i < result.length; i++) {
      const element = result[i];
      asset.ok(element.age !== 7 && element.age !== 8)
    }
    asset.equal(result.length, 1)
  })
})

describe('test', function () {
  const data = [
    { _id: ObjectId.newString(), name: '45666', age: 18 },
    { _id: ObjectId.newString(), name: '153', age: 18 },
    { _id: ObjectId.newString(), name: '153', age: 17 },
    { _id: ObjectId.newString(), name: '87156', age: 15 },
    { _id: ObjectId.newString(), name: '12313223', age: 16 },
    { _id: ObjectId.newString(), name: '4565', age: 15 },
    { _id: ObjectId.newString(), name: '666', age: 14 },
    { _id: ObjectId.newString(), name: '6', age: 14 },
    { _id: ObjectId.newString(), name: 'noage' },
  ]
  it('# &&', function () {
    const result = objectArrayFind(data, { age: 14, name: '666' })
    console.log(result)
    for (let i = 0; i < result.length; i++) {
      const element = result[i];
      asset.strictEqual(element.age, 14)
      asset.strictEqual(element.name, '666')
    }
    asset.equal(result.length, 1)
  })

  it('# $and', function () {
    const result = objectArrayFind(data, { $and: [{ age: 14 }, { name: '666' }] })
    console.log(result)
    for (let i = 0; i < result.length; i++) {
      const element = result[i];
      asset.strictEqual(element.age, 14)
      asset.strictEqual(element.name, '666')
    }
    asset.equal(result.length, 1)
  })

  it('# objectArrayFind() $or1', function () {
    const result = objectArrayFind(data, { $or: [{ age: 15 }, { name: '666' }] })
    console.log(result)
    for (let i = 0; i < result.length; i++) {
      const element = result[i];
      asset.ok(element.name === '666' || element.age === 15)
    }
    asset.equal(result.length, 3)
  })

  it('# objectArrayFind() $or2', function () {
    const result = objectArrayFind(data, { $or: [{ age: 15, name: '87156' }, { age: 14 }] })
    console.log(result)
    for (let i = 0; i < result.length; i++) {
      const element = result[i];
      asset.ok(element.age === 14 || element.age === 15)
    }
    asset.equal(result.length, 3)
  })

  it('# objectArrayFind() $nor', function () {
    const result = objectArrayFind(data, { $nor: [{ age: 15 }, { name: '666' }] })
    console.log(result)
    for (let i = 0; i < result.length; i++) {
      const element = result[i];
      asset.ok(element.name !== '666' && element.age !== 15)
    }
    asset.equal(result.length, 6)
  })

  it('# objectArrayFind() $not', function () {
    const result = objectArrayFind(data, { age: { $not: { $gte: 17 } } })
    console.log(result)
    for (let i = 0; i < result.length; i++) {
      const element = result[i];
      asset.ok(!element.age || element.age < 17)
    }
    asset.equal(result.length, 6)
  })

  it('# objectArrayFind() $exists', function () {
    const result = objectArrayFind(data, { age: { $exists: false } })
    console.log(result)
    for (let i = 0; i < result.length; i++) {
      const element = result[i];
      asset.ok(element.age === undefined)
    }
    asset.equal(result.length, 1)
  })

  it('# objectArrayFind() $regex', function () {
    const result = objectArrayFind(data, { name: { $regex: /6/ } })
    console.log(result)
    for (let i = 0; i < result.length; i++) {
      const element = result[i];
      asset.ok(/6/.test(element.name))
    }
    asset.equal(result.length, 5)
  })

  it('# objectArrayFind() $where', function () {
    let result = objectArrayFind(data, { $where: "this.name.length > 4" })
    console.log(result)
    for (let i = 0; i < result.length; i++) {
      const element = result[i];
      asset.ok(element.name.length > 4)
    }
    asset.equal(result.length, 4)
    
    result = objectArrayFind(data, { $where: "function () { return this.name.length > 4 }" })
    console.log(result)
    for (let i = 0; i < result.length; i++) {
      const element = result[i];
      asset.ok(element.name.length > 4)
    }
    asset.equal(result.length, 4)

    result = objectArrayFind(data, { $where: function () { return this.name.length > 4 } })
    console.log(result)
    for (let i = 0; i < result.length; i++) {
      const element = result[i];
      asset.ok(element.name.length > 4)
    }
    asset.equal(result.length, 4)

    result = objectArrayFind(data, { $where() { return this.name.length > 4 } })
    console.log(result)
    for (let i = 0; i < result.length; i++) {
      const element = result[i];
      asset.ok(element.name.length > 4)
    }
    asset.equal(result.length, 4)
  })

  it('# objectArrayFind() complex', function () {
    const result = objectArrayFind(data, { name: '6', $or: [{ age: { $gte: 17 }, name: '153' }, { age: 14 }] })
    console.log(result)
    asset.strictEqual(result.length, 1)
  })

  it('# objectArrayFind() function', function () {
    const result = objectArrayFind(data, { age() { return this >= 15 }, name() { return this.length < 5 } })
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
})
