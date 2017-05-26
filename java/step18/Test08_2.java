/*5/26  채팅 서버 만들기 - v2
 * => ChatJob들의 연락들을 구축하여 공유.
 * => 이렇게 구축된 연락처는 클라이언트로부터 받은 메시지를
 *  *      다른 클라이언트에게 보낼 때 사용한다. 
 * */
package step18;

import java.io.BufferedReader;
import java.io.DataInputStream;
import java.io.DataOutputStream;
import java.io.InputStreamReader;
import java.io.PrintStream;
import java.net.InetSocketAddress;
import java.net.ServerSocket;
import java.net.Socket;
import java.util.ArrayList;

import com.google.gson.Gson;


public class Test08_2 {

  ArrayList<ChatJob> chatJobs = new ArrayList<>();
  
  class ChatJob implements Runnable {
    Socket socket;
    String address;        
    PrintStream out; //out.println(message);에서 out이 인스턴스 변수가 아니라 오류 발생. 그래서 <추가>
    
    public ChatJob (Socket socket) {
      this.socket = socket;
      this.address = ((InetSocketAddress)socket.getRemoteSocketAddress()).getHostString();      
      System.out.println(address);
      chatJobs.add(this); //생성되는 순간 자신의 주소를 chatJobs에 기록
    }
    
    public void run() {  //run()말고 이외의 run2()등은 오류
      
      try(
          Socket socket = this.socket; //얘가 소켓을 닫아줌
          BufferedReader in = new BufferedReader(
                                        new InputStreamReader(socket.getInputStream()));          
          PrintStream out = new PrintStream(socket.getOutputStream());       
      ) { 
        this.out = out; //다른 스레드가 메시지를 보낼 때 사용<추가>
        
        String alias = in.readLine();  //첫 줄에 넘어온 것은 별명으로 잡음
        //out.printf("[%s]님이 입장하였습니다.\n", alias);<수정>
        sendAll(String.format("[%s : %s]님이 입장하였습니다.", alias, address)); //string에 format이라는 클래스가 있음. 
        
        while (true) {            
            String message = in.readLine(); //문자열 읽어들일 때 한 줄 씩
            if (message == null)  //더 이상 클라이언트쪽에서 데이터를 안보낸다고 하면 반복문 종료
              break; //입출력 끝냄
        
            
            sendAll(String.format("[%s:%s] %s", alias, address,  message)); 
            //sendAll(String.format("[%s: %s] %s", alias, socket.getRemoteSocketAddress().toString() ,message));  //클라이언트에게 요청을 받으면 모든 클라이언트에게 연락처를 전송. 서버가 실행하는 것이 아니고
                                                  //각각의 쓰레드에게 전달만 해주는 것
            //out.println(message); <위에것으로 수정>
            //out.flush(); <위에것으로 수정>
        }
       
      } catch (Exception e) {
        e.printStackTrace();
      }
    }
    
    public void send(String message) throws Exception {  //=> 자신의 고객에게만 메세지를 전달
     // try {
        out.println(message); //메세지 출력
        out.flush(); //<추가>
      //} catch (Exception e) { //예외가 발생하면 연락처 목록에서
       // chatJobs.remove(this); //chatJobs객체를 삭제.
                                      //그래야만 다음에 이 객체를 사용하지 않을  것이다.<여기서 처리하면 안됨.삭제>
      }
    }
 // }
    
  public void listen(int port) throws Exception {
    ServerSocket serverSocket = new ServerSocket(8888);
    System.out.println("서버 실행 중.....");
    
    while (true) {      
      new Thread(new ChatJob(serverSocket.accept())).start();      
       
    }
  }
  
  synchronized public void sendAll(String message) {  //<수정> synchronized추가
    for(int i = chatJobs.size() - 1; i >=0 ; i-- ) {  //마지막배열부터 삭제, 그래야만 순서가 꼬이지 않음
       try {
          chatJobs.get(i).send(message);  //보내라고 신호했는데 연락이 끊겨서 메세지를 못받으면
         // System.out.println(message);  //<테스트>
        } catch (Exception e) {  //[장점]프로그램을 실행하다가 예외가 생기더라고 프로그램을 멈추지 않고
                                         //적당한 조치를 취하고 계속 처리하게 만드는 문법 : 예외처리 문법
                                         //(해당되는 연락처만 제외하고 실행)
          chatJobs.remove(i);//해당되는 chatJob을 리무브
        }
      }
    }
  
  
  public static void main(String[] args) throws Exception{
    Test08_2 server = new Test08_2();
    server.listen(8888);
  }   
}    
