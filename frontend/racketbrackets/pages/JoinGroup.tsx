import {useRef} from "react";

const JoinGroup = () => {
    const groupNameRef = useRef<HTMLInputElement>(null);



    return(
        <div>
            <head><title>Join Group</title></head>
            <p>Request to join a group:</p>
            <form method="post">
                <input type="text" name="Group Name"/>
                <button>Request to Join</button>
            </form>
        </div>
    );
};

export default  JoinGroup;
