    
        const codeData = [
            `NEW
CLS
10 X=0:Y=0
20 CLS
30 IF X=59 THEN Y=Y+1
40 IF X=59 THEN X=0
50 LC13,12:X=X+1:?Y,":",X
60 LED1:WAIT30:LED0:WAIT30:GOTO20
RUN
`,
            `new
cls
10 CLS
20 LC20,20:?"#";:WAIT10
30 LC20,23:?"#";:WAIT10
40 LC23,19:?"#";:WAIT10
50 LC24,22:?"#";:WAIT10
60 LC27,23:?"#";:WAIT10
70 LC29,23:?"#";:WAIT10
80 LC31,22:?"#";:WAIT10
90 GOTO10
run
`,
            `NEW
CLV
CLS
10 CLS
20 X=109:Y=20
30 ?"1-1-1",X,"+",Y,"=",X+Y:?""
40 ?"1-1-2",X,"-",Y,"=",X-Y:?""
50 ?"1-1-3",X,"*",Y,"=",X*Y:?""
60 ?"1-1-4",X,"/",Y,"=",X/Y:?""
70 ?"1-1-5",X,"%",Y,"=",X%Y:?""
80 X=100:Y=30:?""
90 ?"3","800 / 32 = ",800/32:?""
100 ?"2-1-1",X,"-",Y,"=",X-Y:?""
110 ?"2-1-2",X,"*",Y,"=",X*Y:?""
120 ?"2-1-3",X,"/",Y,"=",X/Y:?""
130 ?"2-1-4",X,"%",Y,"=",X%Y:?""
RUN
`
            ,
            `NEW
CLV
CLS
10 Y=22:V=99:X=15:U=5:S=0
20 IF V!=99 Y=Y+V:V=V+1
30 IF Y>22 Y=22:V=99:S=S+1
40 X=X+U
50 IF X>15 U=U-1
60 IF X<15 U=U+1
70 IF INKEY()=32 V=-3
80 CLS
90 LC 15,Y:?"@"
100 LC X,22:?"-"
110 LC 0,0:?"SCORE:";S
120 IF Y=22 AND X=15 END
130 WAIT 5 : GOTO 20
RUN
`
            ,
            `NEW
CLV
CLS
10 A=17:X=0:Y=0:U=0:V=0:C=0:D=0
20 T=0:S=-1
30 IF U*(X<=0)+U*(30<=X) U=U*-1
40 IF V*(Y<=1) V=V*-1
50 IF U X=X+U:Y=Y+V
60 IF (Y=21)*(A-2<X)*(X<A+2) V=V*-1
70 IF V*(21<Y) X=0:Y=0:U=0:V=0
80 IF U*(Y=D)*(C-2<X)*(X<C+2) T=0
90 IF T=0 S=S+1
100 IF T%30=0 C=RND(29)+1:D=RND(17)+1
110 K=INKEY()
120 IF K=28 IF 1<A A=A-1
130 IF K=29 IF A<29 A=A+1
140 IF K=32 X=A:Y=21:U=1:V=-1
150 CLS
160 PRINT"SCORE:";S
170 LOCATE A-1,22:PRINT"==="
180 IF U LOCATE X,Y:PRINT"o"
190 LOCATE C-1,D:PRINT"###"
200 WAIT 2:T=T+1:GOTO 30
RUN
`
            ,
            `NEW
CLV
CLS
10 A=12:X=0:Y=0:B=99:S=0:T=1000
20 IF X X=X+4
30 IF (30<X)*(Y=B) B=99:S=S+1
40 IF 31<X X=0
50 IF B=99 B=RND(22)+1
60 K=INKEY()
70 IF (K=30)*(A>2) A=A-1
80 IF (K=31)*(A<22) A=A+1
90 IF (K=32)*(X=0) X=1:Y=A
100 CLS
110 LOCATE 0,A:PRINT"}"
120 IF X LOCATE X,Y:PRINT"-"
130 LOCATE 31,B:PRINT"X"
140 LOCATE 0,0:PRINT"SCORE:";S
150 LOCATE 10,0:PRINT"TIME:";T
160 WAIT 2
170 T=T-5
180 IF T<0:END
190 GOTO 20
RUN
`
            ,
            `NEW
CLV
CLS
10 X=16:Y=13:A=99:B=99:S=5:T=0
20 K=INKEY()
30 IF K=28 X=X-1:IF X<0 X=30
40 IF K=29 X=X+1:IF 30<X X=0
50 IF K=30 Y=Y-1:IF Y<1 Y=22
60 IF K=31 Y=Y+1:IF 22<Y Y=1
70 IF (X=A)*(Y=B) S=S-1:A=99:B=99
80 IF A=99 A=RND(31):B=RND(22)+1
90 CLS
100 LOCATE X,Y:PRINT"@"
110 LOCATE A,B:PRINT"0"
120 LOCATE 0,0:PRINT"BREADS:";S
130 LOCATE 12,0:PRINT"TIME:";T
140 IF S=0 END
150 WAIT 2
160 T=T+1
170 GOTO 20
RUN
`
            ,
            `NEW
CLV
CLS
10 CLS:S=0:Y=21:Z=1:L=10:X=2:I=2
20 LOCATE L,I:PRINT"|  |":I=I+1
30 IF I<21 GOTO 20
40 IF S%Y=0 A=RND(2)+1:B=1
50 K=INKEY()
60 LOCATE X+L,20:PRINT" "
70 IF K=28 IF X>1 X=X-1
80 IF K=29 IF X<2 X=X+1
90 LOCATE X+L,20:PRINT"A"
100 IF B-Z<21 LOCATE L+A,B-Z:PRINT" "
110 IF B<21 LOCATE L+A,B:PRINT"V":B=B+Z
120 IF VPEEK(L+X,19)!=32 END
130 LOCATE 1,1:PRINT"SCORE:";S/10
140 S=S+1:GOTO 40
RUN
`
            ,
            `NEW
CLV
CLS
10 H=13:I=16:X=1:Y=1:T=0:S=0:C=100
20 IF T=0 X=RND(3):Y=RND(3)
30 T=T+1
40 CLS
50 LOCATE 0,0:PRINT"SCORE:";S
60 LOCATE 10,0:PRINT"TIME:";C
70 LOCATE H,I-0:PRINT"1 2 3"
80 LOCATE H,I-3:PRINT"4 5 6"
90 LOCATE H,I-6:PRINT"7 8 9"
100 LOCATE H+X*2,I-Y*3-1:PRINT"@"
110 IF C=0 END
120 K=INKEY()
130 IF K-49=Y*3+X S=S+1:T=0
140 IF T%10=0 T=0
150 WAIT 5
160 C=C-1
170 GOTO 20
RUN
`
            ,
            `NEW
CLV
CLS
10 CLS:X=1:Y=4:P=0:V=0:A=0:B=0:C=0:D=0:E=0:T=0
20 LOCATE12,4:?"$"
30 LOCATE18,8:?"$"
40 LOCATE4,12:?"$"
50 LOCATE21,16:?"$"
60 LOCATE0,20:?"$"
70 LOCATEX,Y:?"K"
80 LOCATE0,5:?"==============================="
90 LOCATE0,9:?"==============================="
100 LOCATE0,13:?"==============================="
110 LOCATE0,17:?"==============================="
120 LOCATE0,21:?"==============================="
130 LOCATE28,0:?"$=";P
140 LOCATE0,0:?"TIME:";T
150 K=INKEY()
160 IF K=28 IF X>0 X=X-1:LOCATEX+1,Y:?" "
170 IF K=29 IF X<30 X=X+1:LOCATEX-1,Y:?" "
180 IF K=30 LOCATEX,Y:?" ":Y=Y-4
190 IF K=31 LOCATEX,Y+1:?" "
200 IF (VPEEK(X,Y+1)!=61) Y=Y+V:V=V+1:IF V>1 V=1
210 IF X=12 IF Y=4 IF A=0 P=P+1:A=1
220 IF X=18 IF Y=8 IF B=0 P=P+1:B=1
230 IF X=4 IF Y=12 IF C=0 P=P+1:C=1
240 IF X=21 IF Y=16 IF D=0 P=P+1:D=1
250 IF X=0 IF Y=20 IF E=0 P=P+1:E=1
260 IF P=5 LOCATEX,Y:?"K":LOCATE28,0:?"$=";P:END
270 IF Y=21 END
280 LOCATEX,Y-1:?" ":WAIT 1:T=T+1:GOTO 70
RUN
`
        ];
        
        function simulateKeyPress(character) {
            // Tạo sự kiện keydown
            var event = new KeyboardEvent('keydown', {
                key: character,
                bubbles: true,
                cancelable: true
            });

            // Gửi sự kiện tới phần tử
            document.body.dispatchEvent(event);

            // Tạo sự kiện keyup để mô phỏng việc thả phím
            var eventUp = new KeyboardEvent('keyup', {
                key: character,
                bubbles: true,
                cancelable: true
            });

            // Gửi sự kiện tới phần tử
            document.body.dispatchEvent(eventUp);
        }

        function sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }
        async function typeNextCharacter() {
            var index = 0;
            for (const text of codeData) {
                console.log(text);
                for (const txt of text.split('')) {
                    // Lấy ký tự hiện tại
                    var character = txt;
                    // Mô phỏng việc nhấn phím
                    simulateKeyPress(character.toLowerCase());

                    // // Tăng biến đếm lên để xử lý ký tự tiếp theo
                    // index++;

                    // // Thêm ký tự vào ô input
                    // document.body.value += character;

                    // Đặt hàm này chạy lại sau 100ms
                    await sleep(randomNum(100,500));
                }
                await sleep(30000);
                simulateKeyPress('Escape');
            }
            await setTimeout(typeNextCharacter, 100);
        }
        setTimeout(typeNextCharacter, 1000);
        function randomNum(min, max) {
            return Math.floor(Math.random() * (max - min)) + min; // You can remove the Math.floor if you don't want it to be an integer
        }
    