
    const filePath = process.env.npm_config_filePath || '';
    const func = require(filePath);
    test('0',()=>{
        expect(func(5,1)).toBe(6)
      });
      test('1',()=>{
        expect(func(-7,6)).toBe(-1)
      });
      