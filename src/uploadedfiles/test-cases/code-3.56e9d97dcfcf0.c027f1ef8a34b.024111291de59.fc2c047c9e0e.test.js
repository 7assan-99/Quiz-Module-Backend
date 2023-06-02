
    const filePath = process.env.npm_config_filePath || '';
    const func = require(filePath);
    test('0',()=>{
        expect(func(1,7)).toBe(8)
      });
      test('1',()=>{
        expect(func(-7,6)).toBe(-1)
      });
      