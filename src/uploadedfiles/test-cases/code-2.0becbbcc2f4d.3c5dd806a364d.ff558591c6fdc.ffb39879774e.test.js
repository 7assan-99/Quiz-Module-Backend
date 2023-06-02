
    const filePath = process.env.npm_config_filePath || '';
    const func = require(filePath);
    test('0',()=>{
        expect(func(1,5)).toBe(5)
      });
      test('1',()=>{
        expect(func(-2,5)).toBe(-10)
      });
      test('2',()=>{
        expect(func(6,0)).toBe(0)
      });
      