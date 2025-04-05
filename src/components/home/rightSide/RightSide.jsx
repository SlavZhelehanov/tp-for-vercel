import Promotion from "../Promotion";
// import UserCard from "../user/UserCard";
import UserInfo from "../user/UserInfo";
// import Birthdays from "./Birthdays";
// import FriendRequests from "./FriendRequests";

export default function RightSide({ user, ads, useAds }) {
    return (
        <div className="flex flex-col gap-6">
            {user ?
                (<>
                    <UserInfo user={user} />
                    {/* <UserCard user={user} /> */}
                </>)
                : null}
            {/* // TODO: When add data base */}
            {/* <FriendRequests />
            <Birthdays /> */}
            {/* <Promotion size={"md"} /> */}
        </div>
    );
}