import Avatar from "./Avatar";
import UserInfo from "./UserInfo";

const styles = {
  image: {
    width: 100,
    height: 100,
    borderRadius: 50
  }
};
// 댓글 컴포넌트
// 실제 렌더링은 안하고 단순 연습용 예제
function CommentEx(props) {
  console.log(props);
  return (
    <>
      {/* 원본 */}
      <div className="comment">
        <div className="user-info">
          <img className="avatar"
            src={props.author.avatarUrl}
            alt={props.author.name}
            style={styles.image}
          />
          <div className="user-info-name">
            {props.author.name}
          </div>
        </div>

        <div className="comment-text">
          {props.text}
        </div>

        <div className="comment-date">
          {props.date}
        </div>
      </div>

      <div className="comment">
        {/* 2) 사용자 정보를 컴포넌트로 추출 */}
        <UserInfo user={props.author} />

        <div className="comment-text">
          {props.text}
        </div>
        
        <div className="comment-date">
          {props.date}
        </div>
      </div>
    </>
  );
}

export default CommentEx;