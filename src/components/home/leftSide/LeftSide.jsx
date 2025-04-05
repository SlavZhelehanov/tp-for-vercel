import { Link } from "react-router";
import { FaRegChartBar, FaRegNoteSticky, FaRegImages, FaRegNewspaper, FaUserGraduate } from "react-icons/fa6";
import ProfileCard from "./ProfileCard";
import Promotion from "../Promotion";

export default function LeftSide({ type }) {
    // type = "home" | "profile"
    return (
        <div className="flex flex-col gap-6">
            {type === "home" && <ProfileCard />}

            {/* //TODO: When add Data Base */}
            {/* <div className="p-4 bg-white rounded-lg shadow-md text-sm text-gray-500 flex flex-col gap-2">
                <Link to="/auth/my-posts" className="flex items-center gap-4 p-2 rounded-lg hover:bg-slate-100"><FaRegChartBar /><span>My Posts</span></Link>
                <hr className="border-t-1 border-gray-50 w-36 self-center" />
                <Link to="/auth/events" className="flex items-center gap-4 p-2 rounded-lg hover:bg-slate-100"><FaRegNoteSticky /><span>Events</span></Link>
                <hr className="border-t-1 border-gray-50 w-36 self-center" />
                <Link to="/auth/albums" className="flex items-center gap-4 p-2 rounded-lg hover:bg-slate-100"><FaRegImages /><span>Albums</span></Link>
                <hr className="border-t-1 border-gray-50 w-36 self-center" />
                <Link to="/auth/news" className="flex items-center gap-4 p-2 rounded-lg hover:bg-slate-100"><FaRegNewspaper /><span>News</span></Link>
                <hr className="border-t-1 border-gray-50 w-36 self-center" />
                <Link to="/auth/courses" className="flex items-center gap-4 p-2 rounded-lg hover:bg-slate-100"><FaUserGraduate /><span>Courses</span></Link>
            </div> */}
            {/* <Promotion size="sm" /> */}
        </div>
    );
}