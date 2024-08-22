import UnfollowedUsers from "@components/followsDir/UnfollowedUsers";

const AddUsersPage = () => {
  return (
    <>
        <h2 className="text-xl font-semibold mb-4">Connect With Other Users</h2>

        <div className="container mx-auto p-6">
            <UnfollowedUsers />
        </div>
    </>
  );
};

export default AddUsersPage;
