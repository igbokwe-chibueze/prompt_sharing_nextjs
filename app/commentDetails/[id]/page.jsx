"use client";

import Loading from "@app/loading";
import { CommentCardList } from "@components/commentsDir";
import { Suspense } from "react";

const CommentDetails = ({ params }) => {

  return (
    <div className="container mx-auto p-4">
      <h1 className="head_text text-left">
        <span className="blue_gradient">Comment Details</span>
      </h1>

      <Suspense fallback={<Loading/>}>
        <CommentCardList params={params} entityType={"comment"}/>
      </Suspense>


    </div>
  );
};

export default CommentDetails;
