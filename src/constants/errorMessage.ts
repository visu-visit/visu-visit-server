interface IError {
  [key: string]: string;
}

const ERROR: IError = {
  INTERNAL_SERVER: "내부 서버 에러",
  HISTORY_PROCESS:
    "히스토리 파일을 서버에서 처리하는 중에 에러가 발생했습니다.",
};

export default ERROR;
