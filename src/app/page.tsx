import Form from './components/Form';

export default function Home() {
  return (
    <div className="flex flex-col gap-5 mt-52 items-center">
      <h1 className="text-2xl ">
        지난 기후를 한눈에! <br />
        연도를 선택해 통계를 확인하세요.
      </h1>
      <Form />
    </div>
  );
}
