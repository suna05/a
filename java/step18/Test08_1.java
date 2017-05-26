/*5/26  채팅 서버 만들기 - v1
 * => 
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

import com.google.gson.Gson;


public class Test08_1 {

  
  class ChatJob implements Runnable {
    Socket socket;
        
    public ChatJob (Socket socket) {
      this.socket = socket;
      System.out.println("=> 클라이언트와 연결되었음!");
    }
    
    public void run() {  //run()말고 이외의 run2()등은 오류
      
      try(
          Socket socket = this.socket; //얘가 소켓을 닫아줌
          BufferedReader in = new BufferedReader(
                                        new InputStreamReader(socket.getInputStream()));          
          PrintStream out = new PrintStream(socket.getOutputStream());       
      ) {        
        String alias = in.readLine();  //첫 줄에 넘어온 것은 별명으로 잡음
        out.printf("[%s]님이 입장하였습니다.\n", alias);
        
        while (true) {            
            String message = in.readLine(); //문자열 읽어들일 때 한 줄 씩
            if (message == null)  //더 이상 클라이언트쪽에서 데이터를 안보낸다고 하면 반복문 종료
              break; //입출력 끝냄
        
            out.println(message);
            out.flush();
        }
       
      } catch (Exception e) {
        e.printStackTrace();
      }
    }
  }
    
  public void listen(int port) throws Exception {
    ServerSocket serverSocket = new ServerSocket(8888);
    System.out.println("서버 실행 중.....");
    
    while (true) {      
      new Thread(new ChatJob(serverSocket.accept())).start();      
      
      /*
       CalculatorJob job= new CalculatorJob(serverSocket.accept());  // 이 job변수를 아래에서 딱 한 번 씀. 위와 같이 줄여 씀
       new Thread(job).start();  //job에 들어간 것은 Runnable 규칙에 따라 만들어진 객체가 들어옴.
       */
    }
  }
  
  public static void main(String[] args) throws Exception{
    Test08_1 server = new Test08_1();
    server.listen(8888);
    
   
  } 
}    
