var buf = new Buffer(256);
var len = buf.write("www.runoob.com");
console.log('写入字节数：' + len);

var buf1 = new Buffer(26);
for (var i = 0 ; i < 26 ; i++) {
  buf1[i] = i + 97;
}

console.log( buf1.toString('ascii'));       // 输出: abcdefghijklmnopqrstuvwxyz
console.log( buf1.toString('ascii',0,5));   // 输出: abcde
console.log( buf1.toString('utf8',0,5));    // 输出: abcde
console.log( buf1.toString(undefined,0,5)); // 使用 'utf8' 编码, 并输出: abcde

var buf2 = new Buffer("www.runoob.com");
var json = buf.toJSON(buf);
console.log(json);

var buffer1 = new Buffer('菜鸟教程 ');
var buffer2 = new Buffer('www.runoob.com');
var buffer3 = Buffer.concat([buffer1,buffer2]);
console.log("buffer3 内容: " + buffer3.toString());

var buffer1 = new Buffer('ABC');
var buffer2 = new Buffer('ABCD');
var result = buffer1.compare(buffer2);

if(result < 0) {
   console.log(buffer1 + " 在 " + buffer2 + "之前");
}else if(result == 0){
   console.log(buffer1 + " 与 " + buffer2 + "相同");
}else {
   console.log(buffer1 + " 在 " + buffer2 + "之后");
}

var buffer1 = new Buffer('ABC');
// 拷贝一个缓冲区
var buffer2 = new Buffer(3);
buffer1.copy(buffer2);
console.log("buffer2 content: " + buffer2.toString());

var buffer1 = new Buffer('runoob');
// 剪切缓冲区
var buffer2 = buffer1.slice(0,2);
console.log("buffer2 content: " + buffer2.toString());
var buffer = new Buffer('www.runoob.com');
//  缓冲区长度
console.log("buffer length: " + buffer.length);