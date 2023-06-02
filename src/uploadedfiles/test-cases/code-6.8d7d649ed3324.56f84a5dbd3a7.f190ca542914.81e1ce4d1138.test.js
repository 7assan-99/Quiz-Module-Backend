
    const filePath = process.env.npm_config_filePath || '';
    const func = require(filePath);
    test('0',()=>{
        expect(func(1.79,68)).toBe('normal')
      });
      test('1',()=>{
        expect(func(1.60,68)).toBe('overweight')
      });
      