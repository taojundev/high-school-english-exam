import { EmptyState } from '../components/ui';

export default function NotFoundPage() {
  return (
    <div className="container page-empty">
      <EmptyState
        eyebrow="404"
        title="这一页不在试卷上"
        description="链接可能已经失效。回到首页，生成一套新的模拟卷。"
        to="/"
        action="返回首页"
      />
    </div>
  );
}
