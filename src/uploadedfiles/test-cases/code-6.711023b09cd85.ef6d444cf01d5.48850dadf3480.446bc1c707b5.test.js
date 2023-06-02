
    const filePath = process.env.npm_config_filePath || '';
    const func = require(filePath);
    test('0',()=>{
        expect(func(4,5)).toBe(20)
      });
      test('1',()=>{
        expect(func(-5,4)).toBe(-20)
      });
      