import { Toast } from './ToastProvider'
export default function Toasts({ toasts }: { toasts: Toast[] }){
  return (
    <div className="fixed bottom-4 right-4 space-y-2 z-50">
      {toasts.map(t => (
        <div key={t.id} className="bg-gray-900 text-white rounded-xl shadow px-4 py-3 max-w-sm">
          {t.title && <div className="font-semibold mb-1">{t.title}</div>}
          <div className="text-sm">{t.message}</div>
        </div>
      ))}
    </div>
  )
}