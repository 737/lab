﻿//       /\\\\\\\\\\\\\\
//       \/\\\//////////
//        \/\\\
//         \/\\\\\\\\\\\
//          \/\\\///////
//           \/\\\
//            \/\\\
//             \/\\\
//              \///


//       /\\\\\\\\\\\\
//       \/////\\\////
//            \/\\\
//             \/\\\
//              \/\\\
//               \/\\\
//                \/\\\
//             /\\\\\\\\\\\\
//             \////////////


//       /\\\\\\\\\\\\\\\\
//       \///////\\\//////
//              \/\\\
//               \/\\\
//                \/\\\
//                 \/\\\
//                  \/\\\
//                   \/\\\
//                    \///


//         /\\\\\\\\\\\\
//        /\\\//////////\\\
//        \//\\\       \///
//          \////\\\
//              \////\\\
//                  \///\\\
//          /\\\       \//\\\
//          \///\\\\\\\\\\\\/
//             \////////////


//        /\\\        ////
//        \///\\\    ////
//           \//\\\ ////
//             \//\////
//               \//\\\
//              /\\//\\\
//              \/// \//\\\
//             /\\\    \//\\\
//             \///      \///

//         /\\\\\\\\\\\
//        /\\\/////////\\\
//        \/\\\       \///
//         \/\\\
//          \/\\\
//           \/\\\
//            \/\\\      /\\\
//             \//\\\\\\\\\\\\
//               \//////////

//       /\\\        /\\\
//       \/\\\       \/\\\
//        \/\\\       \/\\\
//         \/\\\       \/\\\  
//          \/\\\       \/\\\
//           \/\\\       \/\\\ 
//            \/\\\       \/\\\
//             \//\\\\\\\\\\///
//               \////////////

//            /\\\      \\\\
//            \/\\\     \\\\
//             \/\\\    \\\\
//              \/\\\   \\\
//               \/\\\  \\\
//                \/\\\ \\\
//                 \/\\\\\\
//                  \//\\\
//                    \/\\

//            /\\\      \\\\\      \\\\
//            \/\\\     \\\\\\     \\\\
//             \/\\\    \\\\\\\    \\\\
//              \/\\\   \\\ \/\\   \\\\
//               \/\\\  \\\  \/\\  \\\\
//                \/\\\ \\\   \/\\ \\\\
//                 \/\\\\\\    \/\\\\\
//                  \//\\\      \//\\\
//                   \/\\\       \/\\\


//       /\\\\\\\\\\\\\
//       \/\\\/////////
//        \/\\\
//         \/\\\\\\\\
//          \/\\\////
//           \/\\\
//            \/\\\
//             \/\\\\\\\\\\\
//              \///////////




// A B C D E F G H I J K L M N O P Q R S T U V W X Y Z
// B D E F G H I 
// 
// 

















(function(){
    var console = window.console || {
            log : function(){}
        },
        n = '\n' ,
        words = [

            n +'            ┏┓．°． ┏┓            【恭喜您！你得到节操：50克 ！】     '+ n
                +'            ┃┗━━━┛┃'+ n
                +'            ┃ ⌒   ⌒ ┃'+ n
                +'            ┃  ●   ●  ┃                   '+ n
                +'            ┃  ” ω ”  ┃               '+ n
                +'            ┗○━━━━○┛'+ n
            ,


            n +'   ┏┓       ┏┓'+ n
                +' ┏┛┻━━━━┛┻┓'+ n
                +' ┃              ┃                              【神兽在此守护】'+ n
                +' ┃      ━      ┃'+ n
                +' ┃  ┳┛  ┗┳   ┃'+ n
                +' ┃              ┃'+ n
                +' ┃      ┻      ┃'+ n
                +' ┃              ┃'+ n
                +' ┗━━┓   ┏━━┛'+ n
                +'      ┃   ┃'+ n
                +'      ┃   ┃'+ n
                +'      ┃   ┗━━━━-━┓'+ n
                +'      ┃              ┣┓                   '+ n
                +'      ┃              ┏┛'+ n
                +'      ┗┓┓┏━┳┓┏━┛'+ n
                +'        ┃┫┫  ┃┫┫                      '+ n
                +'        ┗┻┛  ┗┻┛'
        ];
    console.log( words[rand(0, words.length - 1 )] );

    //取区间随机整数
    function rand(mi,ma){
        var range = ma - mi;
        var out = mi + Math.round( Math.random() * range) ;
        return parseInt(out);
    }
})