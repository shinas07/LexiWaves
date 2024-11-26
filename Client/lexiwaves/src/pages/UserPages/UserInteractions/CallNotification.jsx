import React from "react";

const CallNotification = ({ call, onAccept, onDecline }) => {
    return (
      <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-xl p-4 max-w-sm w-full">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <Video className="w-8 h-8 text-blue-600" />
          </div>
          <div className="flex-1">
            <h4 className="font-medium">Incoming Video Call</h4>
            <p className="text-sm text-gray-500 mt-1">
              {call.studentName} wants to start a video session
            </p>
            <div className="mt-4 flex gap-3">
              <Button onClick={onAccept} className="bg-green-600 hover:bg-green-700">
                Accept
              </Button>
              <Button onClick={onDecline} variant="outline" className="text-red-600">
                Decline
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  };