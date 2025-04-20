import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { RxCross2 } from "react-icons/rx";
import { useDispatch, useSelector } from "react-redux";
import { createQuiz, updateQuiz, getQuizById } from "../../../../../services/operations/courseDetailsAPI";
import { setCourse } from "../../../../../slices/courseSlice";
import IconBtn from "../../../../common/IconBtn";

export default function QuizModal({
  modalData,
  setModalData,
  add = false,
  view = false,
  edit = false,
}) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    getValues,
  } = useForm();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const { token } = useSelector((state) => state.auth);
  const { course } = useSelector((state) => state.course);
  const [questions, setQuestions] = useState(
    view || edit
      ? modalData.questions.map(q => ({ ...q, reponseIncorrecteList: [...q.reponseIncorrecteList] }))
      : [{ enoncce: "", reponseCorrecte: "", reponseIncorrecteList: ["", "", ""] }]
  );

  // Fetch quiz data for view or edit modes
  useEffect(() => {
    const fetchQuiz = async () => {
      if ((view || edit) && modalData.id) {
        setLoading(true);
        const quizData = await getQuizById(modalData.id, token);
        if (quizData) {
          setValue("quizTitle", quizData.titre);
          setQuestions(quizData.questions.map(q => ({ ...q, reponseIncorrecteList: [...q.reponseIncorrecteList] })));
        }
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [view, edit, modalData, setValue, token]);

  // Add a new question
  const addQuestion = () => {
    setQuestions([...questions, { enoncce: "", reponseCorrecte: "", reponseIncorrecteList: ["", "", ""] }]);
  };

  // Remove a question
  const removeQuestion = (index) => {
    if (questions.length > 1) {
      setQuestions(questions.filter((_, i) => i !== index));
    } else {
      toast.error("A quiz must have at least one question");
    }
  };

  // Update a question field
  const updateQuestion = (index, field, value) => {
    const updatedQuestions = questions.map((q, i) =>
      i === index ? { ...q, [field]: value } : q
    );
    setQuestions(updatedQuestions);
  };

  // Update an incorrect answer
  const updateIncorrectAnswer = (questionIndex, answerIndex, value) => {
    const updatedQuestions = questions.map((q, i) =>
      i === questionIndex
        ? {
            ...q,
            reponseIncorrecteList: q.reponseIncorrecteList.map((ans, j) =>
              j === answerIndex ? value : ans
            ),
          }
        : q
    );
    setQuestions(updatedQuestions);
  };

  // Check if form is updated
  const isFormUpdated = () => {
    const currentValues = getValues();
    if (!edit) return true;
    return (
      currentValues.quizTitle !== modalData.titre ||
      JSON.stringify(questions) !== JSON.stringify(modalData.questions)
    );
  };

  // Handle form submission
  const onSubmit = async (data) => {
    if (view) return;

    if (questions.length === 0) {
      toast.error("Please add at least one question");
      return;
    }

    for (const question of questions) {
      if (!question.enoncce || !question.reponseCorrecte || question.reponseIncorrecteList.some(ans => !ans)) {
        toast.error("Please fill all question fields");
        return;
      }
    }

    const quizData = {
      titre: data.quizTitle,
      chapitreId: edit ? modalData.chapitreId : modalData,
      questions: questions.map(q => ({
        enoncce: q.enoncce,
        reponseCorrecte: q.reponseCorrecte,
        reponseIncorrecteList: q.reponseIncorrecteList,
      })),
    };

    setLoading(true);
    try {
      let result;
      if (edit) {
        if (!isFormUpdated()) {
          toast.error("No changes made to the form");
          setLoading(false);
          return;
        }
        result = await updateQuiz({ id: modalData.id, ...quizData }, token);
      } else {
        result = await createQuiz(quizData, token);
      }

      if (result) {
        const updatedChapters = course.chapitres.map((chapter) =>
          chapter.id === quizData.chapitreId
            ? {
                ...chapter,
                quizList: [result], // Only one quiz per chapter
              }
            : chapter
        );
        dispatch(setCourse({ ...course, chapitres: updatedChapters }));
        setModalData(null);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to save quiz. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] !mt-0 grid h-screen w-screen place-items-center overflow-auto bg-white bg-opacity-10 backdrop-blur-sm">
      <div className="my-10 w-11/12 max-w-[700px] rounded-lg border border-richblack-400 bg-richblack-800">
        <div className="flex items-center justify-between rounded-t-lg bg-richblack-700 p-5">
          <p className="text-xl font-semibold text-richblack-5">
            {view && "Viewing"} {add && "Adding"} {edit && "Editing"} Quiz
          </p>
          <button onClick={() => (!loading ? setModalData(null) : {})}>
            <RxCross2 className="text-2xl text-richblack-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 px-8 py-10">
          <div className="flex flex-col space-y-2">
            <label className="text-sm text-richblack-5" htmlFor="quizTitle">
              Quiz Title {!view && <sup className="text-pink-200">*</sup>}
            </label>
            <input
              disabled={view || loading}
              id="quizTitle"
              placeholder="Enter Quiz Title"
              {...register("quizTitle", { required: true })}
              className="form-style w-full"
            />
            {errors.quizTitle && (
              <span className="ml-2 text-xs tracking-wide text-pink-200">
                Quiz title is required
              </span>
            )}
          </div>
          <div className="flex flex-col space-y-4">
            <label className="text-sm text-richblack-5">Questions {!view && <sup className="text-pink-200">*</sup>}</label>
            {questions.map((question, qIndex) => (
              <div key={qIndex} className="border border-richblack-600 p-4 rounded-md space-y-2">
                <div className="flex justify-between items-center">
                  <p className="text-richblack-5">Question {qIndex + 1}</p>
                  {!view && questions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeQuestion(qIndex)}
                      className="text-pink-200 text-sm"
                    >
                      Remove
                    </button>
                  )}
                </div>
                <div className="flex flex-col space-y-2">
                  <label className="text-xs text-richblack-5" htmlFor={`question-${qIndex}`}>
                    Question Statement
                  </label>
                  <input
                    disabled={view || loading}
                    id={`question-${qIndex}`}
                    placeholder="Enter Question Statement"
                    value={question.enoncce}
                    onChange={(e) => updateQuestion(qIndex, "enoncce", e.target.value)}
                    className="form-style w-full"
                  />
                </div>
                <div className="flex flex-col space-y-2">
                  <label className="text-xs text-richblack-5" htmlFor={`correct-${qIndex}`}>
                    Correct Answer
                  </label>
                  <input
                    disabled={view || loading}
                    id={`correct-${qIndex}`}
                    placeholder="Enter Correct Answer"
                    value={question.reponseCorrecte}
                    onChange={(e) => updateQuestion(qIndex, "reponseCorrecte", e.target.value)}
                    className="form-style w-full"
                  />
                </div>
                <div className="flex flex-col space-y-2">
                  <label className="text-xs text-richblack-5">Incorrect Answers</label>
                  {question.reponseIncorrecteList.map((answer, aIndex) => (
                    <input
                      key={aIndex}
                      disabled={view || loading}
                      placeholder={`Incorrect Answer ${aIndex + 1}`}
                      value={answer}
                      onChange={(e) => updateIncorrectAnswer(qIndex, aIndex, e.target.value)}
                      className="form-style w-full"
                    />
                  ))}
                </div>
              </div>
            ))}
            {!view && (
              <button
                type="button"
                onClick={addQuestion}
                className="text-yellow-50 flex items-center gap-x-1"
              >
                <span className="text-lg">+</span> Add Question
              </button>
            )}
          </div>
          {!view && (
            <div className="flex justify-end">
              <IconBtn
                disabled={loading}
                text={loading ? "Loading..." : edit ? "Save Changes" : "Save"}
              />
            </div>
          )}
        </form>
      </div>
    </div>
  );
}