import { ContentLayout } from "@/layouts/ContentLayout";
import { useChatLayout } from "./useChatLayout";
import { ChatAppSidebar } from "./ChatAppSidebar";
import { ChatAppContent } from "./ChatAppContent";

export const ChatApp = () => {
    const chatLayoutOptions = useChatLayout();
    return (
        <ContentLayout sidebar={<ChatAppSidebar />} {...chatLayoutOptions}>
            <ChatAppContent />
        </ContentLayout>
    );
};