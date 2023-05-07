const standard_input = process.stdin;
standard_input.setEncoding('utf-8');
console.log("Type an input:");

standard_input.on('data', function (data) {
    data = data.replace('\r\n', "").replace('\n', ""); //strip EOL crlf
    const output = data+data;
    console.log("Output:"+output.toString());
    process.exit();
});