const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const {
  ProgramDescriptionError,
  createProgramMessages,
  generateProgramDescription,
  validateProgramContext
} = require("../services/programDescription");

const program = {
  name: "Community learning centres",
  focus: "Education",
  location: "Chennai"
};

describe("validateProgramContext", () => {
  it("trims and returns only supported program context", () => {
    assert.deepEqual(
      validateProgramContext({
        ...program,
        name: "  Community learning centres  ",
        unrelated: "ignored"
      }),
      program
    );
  });

  it("rejects missing program details", () => {
    assert.throws(
      () => validateProgramContext({ name: program.name }),
      { name: "ProgramDescriptionError", statusCode: 400 }
    );
  });

  it("rejects non-object program details", () => {
    assert.throws(
      () => validateProgramContext(null),
      { name: "ProgramDescriptionError", statusCode: 400 }
    );
  });

  it("rejects oversized program details", () => {
    assert.throws(
      () =>
        validateProgramContext({
          ...program,
          name: "x".repeat(161)
        }),
      { name: "ProgramDescriptionError", statusCode: 400 }
    );
  });
});

describe("generateProgramDescription", () => {
  it("requires a server-side provider API key", async () => {
    await assert.rejects(
      generateProgramDescription(program, {
        apiKey: "",
        fetchImpl: () => assert.fail("fetch must not run without an API key")
      }),
      { name: "ProgramDescriptionError", statusCode: 503 }
    );
  });

  it("sends a bounded prompt to the configured OpenAI-compatible provider", async () => {
    let request;
    const description = "A community learning program for local students.";

    const result = await generateProgramDescription(
      { ...program, privateDetails: "must not be sent" },
      {
        apiKey: "test-key",
        baseUrl: "https://llm.example/v1/",
        model: "test-model",
        fetchImpl: async (url, options) => {
          request = { url, options };
          return {
            ok: true,
            json: async () => ({
              choices: [{ message: { content: ` ${description} ` } }]
            })
          };
        }
      }
    );

    assert.equal(result, description);
    assert.equal(request.url, "https://llm.example/v1/chat/completions");
    assert.equal(request.options.headers.Authorization, "Bearer test-key");
    assert.deepEqual(JSON.parse(request.options.body), {
      model: "test-model",
      messages: createProgramMessages(program),
      max_tokens: 180,
      temperature: 0.6
    });
  });

  it("rejects non-HTTPS provider URLs", async () => {
    await assert.rejects(
      generateProgramDescription(program, {
        apiKey: "test-key",
        baseUrl: "http://llm.example/v1",
        fetchImpl: () => assert.fail("fetch must not run over HTTP")
      }),
      { name: "ProgramDescriptionError", statusCode: 500 }
    );
  });

  it("returns a safe error when the provider fails", async () => {
    await assert.rejects(
      generateProgramDescription(program, {
        apiKey: "test-key",
        fetchImpl: async () => ({ ok: false, status: 429 })
      }),
      (error) =>
        error instanceof ProgramDescriptionError &&
        error.statusCode === 502 &&
        !error.message.includes("429")
    );
  });

  it("rejects an empty model response", async () => {
    await assert.rejects(
      generateProgramDescription(program, {
        apiKey: "test-key",
        fetchImpl: async () => ({
          ok: true,
          json: async () => ({ choices: [{ message: { content: " " } }] })
        })
      }),
      { name: "ProgramDescriptionError", statusCode: 502 }
    );
  });
});
