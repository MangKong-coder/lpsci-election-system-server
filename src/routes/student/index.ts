// ANCHOR Status Codes
import * as status from 'http-status-codes';

// ANCHOR Koa
import Router from 'koa-router';

// ANCHOR Utils
import { setStateValidatedPayload } from '../../utils/middlewares/validation';
import { setStateStudentFromParams } from '../../utils/middlewares/params/student';
import { setStateUserFromParams } from '../../utils/middlewares/params/user';

// ANCHOR Controllers
import {
  getAllStudents, getStudentById, createStudent, updateStudent,
} from '../../controllers/student';

// ANCHOR Schema
import { createUpdateStudentSchema } from '../../models/payloads/schema/student';

// ANCHOR Payloads
import { studentToFetchPayload } from '../../models/payloads/student';

// ANCHOR Middlewares
import { requireSignIn, requireAdmin } from '../../utils/middlewares/auth';
import {
  setCacheAllStudent, setCacheStudent, getCacheAllStudent, getCacheStudent,
} from '../../utils/middlewares/cache/student';

// ANCHOR Router
import { studentVoteRouter } from './votes';

/* ANCHOR: Router export ---------------------------------------------------- */
export const studentRouter = new Router({ prefix: '/student' });

/* ANCHOR: Get all students ---------------------------------------------------- */
studentRouter.get(
  '/',
  requireAdmin,
  getCacheAllStudent,
  async (ctx) => {
    const { students } = ctx.state.cache;

    if (students) {
      ctx.status = status.OK;
      ctx.body = students;
    } else {
      const result = await getAllStudents();
      const parsedStudent = result.map(studentToFetchPayload);

      if (result) {
        ctx.status = status.OK;
        ctx.body = parsedStudent;
        // Set cache
        setCacheAllStudent(parsedStudent);
      } else {
        ctx.status = status.NOT_FOUND;
      }
    }
  },
);

/* ANCHOR: Get student by id ---------------------------------------------------- */
studentRouter.get(
  '/:studentId',
  getCacheStudent('studentId'),
  async (ctx) => {
    const { student } = ctx.state.cache;

    if (student) {
      ctx.status = status.OK;
      ctx.body = student;
    } else {
      const { studentId } = ctx.params;

      const result = await getStudentById(studentId);

      if (result) {
        const parsedStudent = studentToFetchPayload(result);

        ctx.status = status.OK;
        ctx.body = parsedStudent;
        // Set cache
        setCacheStudent(studentId, parsedStudent);
      } else {
        ctx.status = status.NOT_FOUND;
      }
    }
  },
);


/* ANCHOR: Create student ---------------------------------------------- */
studentRouter.post(
  '/:userId',
  requireAdmin,
  setStateValidatedPayload(createUpdateStudentSchema),
  setStateUserFromParams('userId'),
  async (ctx) => {
    const { payload, userParam } = ctx.state;
    const newStudent = await createStudent(payload, userParam);

    ctx.status = status.CREATED;
    ctx.body = newStudent;

    // Revalidate cache
    const result = await getAllStudents();
    const parsedStudent = result.map(studentToFetchPayload);

    setCacheAllStudent(parsedStudent);
  },
);

/* ANCHOR: Update student ---------------------------------------------- */
studentRouter.put(
  '/:studentId',
  requireSignIn,
  setStateStudentFromParams('studentId'),
  setStateValidatedPayload(createUpdateStudentSchema),
  async (ctx) => {
    const { student, payload } = ctx.state;
    const newStudent = await updateStudent(payload, student);

    ctx.status = status.OK;
    ctx.body = newStudent;

    // Revalidate cache
    const result = await getAllStudents();
    const parsedStudent = result.map(studentToFetchPayload);

    setCacheAllStudent(parsedStudent);
  },
);

// ANCHOR Merge sub router for student router
studentRouter.use(
  '/:studentId',
  // Merge vote router
  studentVoteRouter.routes(),
  studentVoteRouter.allowedMethods(),
);
