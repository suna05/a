/*5/25  소켓프로그래밍:  connectionful 서버 만들기
 * => 한 번 
 * 
 * */
package step18;

import java.io.BufferedReader;
import java.io.DataInputStream;
import java.io.DataOutputStream;
import java.io.InputStreamReader;
import java.io.PrintStream;
import java.net.ServerSocket;
import java.net.Socket;
import java.util.Scanner;

import com.google.gson.Gson;


public class Test07_hw {
  class Chat {
    //String mesenger;
    String content;
    String id;
  }
  
  class MesengerServer implements Runnable {
    Socket socket;
        
    public MesengerServer(Socket socket) {
      this.socket = socket;
      System.out.println("=> 클라이언트와 연결되었음!");
    }
    
    
    public void run() {  //run()말고 이외의 run2()등은 오류
      int count = 0;
      try(
          Socket socket = this.socket; //얘가 소켓을 닫아줌
         
          //Scanner in = new Scanner(socket.getInputStream());
          BufferedReader in = new BufferedReader(
                                        new InputStreamReader(socket.getInputStream()));          
          PrintStream out = new PrintStream(socket.getOutputStream());
       
          
      ) {
//        String id = in.readLine();
//        String content = in.readLine();
//        String message = in.readLine();
//        out.println( id + message);
//        out.println( content + message + '\n');
        
        String id = in.readLine();
        String content = in.readLine();
        //String message = in.readLine();
        out.println(id);
        out.println(content);
        //out.println( content + message + '\n');
        
        
        //연결되어 있는 동안 계속 클라이언트와 통신하기.
        while (true) {            
            String json = in.readLine(); //문자열 읽어들일 때 한 줄 씩
            if (json == null)
              break;
                   
            
            System.out.println(json);  
            
            
            //Gson 객체를 이용해 JSON문자열을 Value객체로 만든다.
            Gson gson = new Gson();
            
            Chat chat = gson.fromJson(json, Chat.class);
            
            //out.println(chat.id);
            //out.println(chat.content);
            
            String result = null;
          
            
   
            if (++count > 5 ) {  //무료 사용 횟수를 넘으면 계산을 안해준다.
              out.println("무료 사용 끝!");
            } else {
            out.println(result);
            }
            out.flush();
        }
        
        System.out.println("=> 클라이언트와 연결 끊김");
        
      } catch (Exception e) {
        e.printStackTrace();
      }
    }
  }
  
  
//  class MesengerServer2 implements Runnable {
//    Socket socket2;
//        
//    public MesengerServer2(Socket socket2) {
//      this.socket2 = socket2;
//      System.out.println("=>2클라이언트와 연결되었음!");
//    }
//    
//    
//    public void run() {  //run()말고 이외의 run2()등은 오류
//      int count = 0;
//      try(
//          Socket socket2 = this.socket2; //얘가 소켓을 닫아줌
//         
//          //Scanner in = new Scanner(socket.getInputStream());
//          BufferedReader in = new BufferedReader(
//                                        new InputStreamReader(socket2.getInputStream()));          
//          PrintStream out = new PrintStream(socket2.getOutputStream());
//       
//          
//      ) {
////        String id = in.readLine();
////        String content = in.readLine();
////        String message = in.readLine();
////        out.println( id + message);
////        out.println( content + message + '\n');
//        
//        String id = in.readLine();
//        String content = in.readLine();
//        //String message = in.readLine();
//        out.println(id);
//        out.println(content);
//        //out.println( content + message + '\n');
//        
//        
//        //연결되어 있는 동안 계속 클라이언트와 통신하기.
//        while (true) {            
//            String json = in.readLine(); //문자열 읽어들일 때 한 줄 씩
//            if (json == null)
//              break;
//                   
//            //Gson 객체를 이용해 JSON문자열을 Value객체로 만든다.
//            Gson gson = new Gson();
//            
//            Chat chat = gson.fromJson(json, Chat.class);
//            
//            String result = null;
//          
//            
//   
//            if (++count > 5 ) {  //무료 사용 횟수를 넘으면 계산을 안해준다.
//              out.println("무료 사용 끝!");
//            } else {
//            out.println(result);
//            }
//            out.flush();
//        }
//        
//        System.out.println("=> 2클라이언트와 연결 끊김");
//        
//      } catch (Exception e) {
//        e.printStackTrace();
//      }
//    }
//  }
  
  
  
  public void listen(int port) throws Exception {
    ServerSocket serverSocket = new ServerSocket(8888);
    //ServerSocket serverSocket2 = new ServerSocket(8888);
    System.out.println("서버 실행 중.....");
    
    while (true) {      
      new Thread(new MesengerServer(serverSocket.accept())).start();      
      //new Thread(new MesengerServer2(serverSocket2.accept())).start();  
      /*
       CalculatorJob job= new CalculatorJob(serverSocket.accept());  // 이 job변수를 아래에서 딱 한 번 씀. 위와 같이 줄여 씀
       new Thread(job).start();  //job에 들어간 것은 Runnable 규칙에 따라 만들어진 객체가 들어옴.
       */
    }
  }
  
  public static void main(String[] args) throws Exception{
    Test07_hw server = new Test07_hw();
    server.listen(8888);
    
   
  } 
}    
