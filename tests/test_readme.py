"""
Tests for README.md structure and content.

Validates that the DevOps AtlasX README contains all required sections,
correct severity classifications, target audience definitions, and
proper documentation completeness.
"""

import os
import re
import pytest

README_PATH = os.path.join(os.path.dirname(__file__), "..", "README.md")


@pytest.fixture(scope="module")
def readme_content():
    """Load README.md content once for all tests."""
    with open(README_PATH, "r", encoding="utf-8") as f:
        return f.read()


@pytest.fixture(scope="module")
def readme_lines(readme_content):
    """Split README into lines for line-level assertions."""
    return readme_content.splitlines()


@pytest.fixture(scope="module")
def headings(readme_lines):
    """Extract all markdown headings (lines starting with #)."""
    return [line for line in readme_lines if re.match(r"^#{1,6}\s", line)]


# ---------------------------------------------------------------------------
# File existence and basic validity
# ---------------------------------------------------------------------------

class TestReadmeExists:
    def test_readme_file_exists(self):
        assert os.path.isfile(README_PATH), "README.md must exist in the repository root"

    def test_readme_is_not_empty(self, readme_content):
        assert len(readme_content.strip()) > 0, "README.md must not be empty"

    def test_readme_has_minimum_length(self, readme_content):
        """README should be substantial enough to be useful documentation."""
        assert len(readme_content) >= 500, (
            f"README.md is too short ({len(readme_content)} chars); expected at least 500"
        )

    def test_readme_line_count(self, readme_lines):
        """README should have a meaningful number of lines."""
        assert len(readme_lines) >= 50, (
            f"README.md has only {len(readme_lines)} lines; expected at least 50"
        )


# ---------------------------------------------------------------------------
# Title / H1 heading
# ---------------------------------------------------------------------------

class TestReadmeTitle:
    def test_has_h1_title(self, headings):
        h1_headings = [h for h in headings if h.startswith("# ")]
        assert len(h1_headings) == 1, "README must have exactly one H1 heading"

    def test_title_contains_project_name(self, readme_content):
        assert "DevOps AtlasX" in readme_content, (
            "README H1 title must contain the project name 'DevOps AtlasX'"
        )

    def test_title_is_first_non_empty_line(self, readme_lines):
        non_empty = [l for l in readme_lines if l.strip()]
        assert non_empty[0].startswith("# "), (
            "The first non-empty line of README.md must be the H1 title"
        )


# ---------------------------------------------------------------------------
# Required top-level (H2) sections
# ---------------------------------------------------------------------------

REQUIRED_H2_SECTIONS = [
    "What is DevOps AtlasX",
    "Why DevOps AtlasX",
    "How This Helps You",
    "Core Features",
    "What Makes It Different",
    "Who Is This For",
    "Vision",
    "License",
]


class TestRequiredSections:
    @pytest.mark.parametrize("section_title", REQUIRED_H2_SECTIONS)
    def test_required_h2_section_present(self, readme_content, section_title):
        assert section_title in readme_content, (
            f"README.md is missing required section: '{section_title}'"
        )

    def test_has_multiple_h2_headings(self, headings):
        h2_headings = [h for h in headings if h.startswith("## ")]
        assert len(h2_headings) >= 6, (
            f"README.md must have at least 6 H2 headings; found {len(h2_headings)}"
        )


# ---------------------------------------------------------------------------
# Core Features sub-sections (H3)
# ---------------------------------------------------------------------------

REQUIRED_CORE_FEATURES = [
    "Smart Search",
    "Tool-Based Organization",
    "Severity Classification",
    "Root Cause Breakdown",
    "Actionable Fixes",
    "Prevention Guidance",
    "Popular Issue Insights",
]


class TestCoreFeatures:
    @pytest.mark.parametrize("feature", REQUIRED_CORE_FEATURES)
    def test_core_feature_present(self, readme_content, feature):
        assert feature in readme_content, (
            f"README.md is missing core feature section: '{feature}'"
        )

    def test_core_features_section_exists(self, readme_content):
        assert "Core Features" in readme_content

    def test_has_multiple_h3_headings(self, headings):
        h3_headings = [h for h in headings if h.startswith("### ")]
        assert len(h3_headings) >= 5, (
            f"README.md must have at least 5 H3 headings under features; found {len(h3_headings)}"
        )


# ---------------------------------------------------------------------------
# Severity Classification
# ---------------------------------------------------------------------------

class TestSeverityClassification:
    def test_p1_severity_present(self, readme_content):
        assert "P1" in readme_content, "Severity level P1 must be documented"

    def test_p2_severity_present(self, readme_content):
        assert "P2" in readme_content, "Severity level P2 must be documented"

    def test_p3_severity_present(self, readme_content):
        assert "P3" in readme_content, "Severity level P3 must be documented"

    def test_p1_labeled_critical(self, readme_content):
        """P1 must be associated with 'Critical' to convey severity to readers."""
        # Find the P1 line and check it references Critical
        p1_pattern = re.search(r"\*\*P1\*\*.*Critical", readme_content)
        assert p1_pattern is not None, (
            "P1 severity must be labeled as 'Critical production issues'"
        )

    def test_p2_labeled_major(self, readme_content):
        p2_pattern = re.search(r"\*\*P2\*\*.*[Mm]ajor", readme_content)
        assert p2_pattern is not None, (
            "P2 severity must be described as 'Major'"
        )

    def test_p3_labeled_minor(self, readme_content):
        p3_pattern = re.search(r"\*\*P3\*\*.*[Mm]inor", readme_content)
        assert p3_pattern is not None, (
            "P3 severity must be described as 'Minor'"
        )

    def test_all_three_severities_in_order(self, readme_content):
        """P1, P2, P3 must appear in ascending order within the document."""
        p1_pos = readme_content.find("P1")
        p2_pos = readme_content.find("P2")
        p3_pos = readme_content.find("P3")
        assert p1_pos < p2_pos < p3_pos, (
            "Severity levels P1, P2, P3 must appear in order within README.md"
        )


# ---------------------------------------------------------------------------
# Target audience
# ---------------------------------------------------------------------------

EXPECTED_AUDIENCES = [
    "DevOps Engineers",
    "SREs",
    "Backend Engineers",
    "Cloud Engineers",
]


class TestTargetAudience:
    def test_who_is_this_for_section_exists(self, readme_content):
        assert "Who Is This For" in readme_content

    @pytest.mark.parametrize("audience", EXPECTED_AUDIENCES)
    def test_audience_group_mentioned(self, readme_content, audience):
        assert audience in readme_content, (
            f"Target audience '{audience}' must be listed in the 'Who Is This For' section"
        )

    def test_production_systems_mentioned(self, readme_content):
        assert "production systems" in readme_content.lower(), (
            "README must mention 'production systems' as part of its target audience"
        )


# ---------------------------------------------------------------------------
# Vision statement
# ---------------------------------------------------------------------------

class TestVisionStatement:
    def test_vision_section_exists(self, readme_content):
        assert "Vision" in readme_content

    def test_vision_references_devops(self, readme_content):
        # Locate text after the Vision heading
        vision_match = re.search(r"##\s+.*Vision([\s\S]+?)(?=\n## |\Z)", readme_content)
        assert vision_match is not None, "Vision section content not found"
        vision_text = vision_match.group(1)
        assert "DevOps" in vision_text, "Vision statement must reference 'DevOps'"

    def test_vision_references_problem_solving(self, readme_content):
        assert "problem solving" in readme_content.lower() or "solutions" in readme_content.lower(), (
            "Vision statement must reference problem solving or solutions"
        )

    def test_vision_is_non_empty(self, readme_content):
        vision_match = re.search(r"##\s+.*Vision\s*\n+([\s\S]+?)(?=\n## |\Z)", readme_content)
        assert vision_match is not None
        vision_body = vision_match.group(1).strip()
        assert len(vision_body) > 10, "Vision section must contain meaningful content"


# ---------------------------------------------------------------------------
# License section
# ---------------------------------------------------------------------------

class TestLicenseSection:
    def test_license_section_exists(self, readme_content):
        assert "License" in readme_content

    def test_mit_license_specified(self, readme_content):
        assert "MIT" in readme_content, (
            "README.md must specify the MIT license"
        )

    def test_mit_license_in_license_section(self, readme_content):
        license_match = re.search(r"##\s+.*License\s*\n+([\s\S]+?)(?=\n## |\Z)", readme_content)
        assert license_match is not None, "License section content not found"
        license_body = license_match.group(1)
        assert "MIT" in license_body, (
            "The License section body must contain 'MIT'"
        )


# ---------------------------------------------------------------------------
# Markdown structure integrity
# ---------------------------------------------------------------------------

class TestMarkdownStructure:
    def test_no_unclosed_code_blocks(self, readme_content):
        """Triple-backtick code fences must be balanced."""
        fence_count = readme_content.count("```")
        assert fence_count % 2 == 0, (
            f"README.md has {fence_count} triple-backtick fences; they must be balanced (even count)"
        )

    def test_horizontal_rules_present(self, readme_content):
        """README uses '---' horizontal rules to separate sections."""
        assert readme_content.count("---") >= 3, (
            "README.md must contain at least 3 horizontal rules ('---') as section dividers"
        )

    def test_no_heading_without_content(self, readme_lines):
        """Every heading should be followed by non-empty content before the next heading or EOF."""
        for i, line in enumerate(readme_lines):
            if re.match(r"^#{1,6}\s", line):
                # Look ahead for content within the next 5 lines
                subsequent = readme_lines[i + 1: i + 6]
                non_empty_after = [l for l in subsequent if l.strip() and not l.strip() == "---"]
                assert len(non_empty_after) > 0, (
                    f"Heading '{line}' at line {i + 1} appears to have no content following it"
                )

    def test_bullet_lists_use_asterisk(self, readme_lines):
        """Confirm the README uses asterisk-style bullet lists (project convention)."""
        bullet_lines = [l for l in readme_lines if re.match(r"^\*\s", l)]
        assert len(bullet_lines) >= 5, (
            "README.md must contain at least 5 asterisk bullet-list items"
        )

    def test_bold_emphasis_used(self, readme_content):
        """Key terms should be bolded with **text** syntax."""
        bold_matches = re.findall(r"\*\*[^*]+\*\*", readme_content)
        assert len(bold_matches) >= 3, (
            f"README.md must use bold (**text**) for key terms; found only {len(bold_matches)}"
        )


# ---------------------------------------------------------------------------
# Content quality / value proposition
# ---------------------------------------------------------------------------

class TestContentQuality:
    def test_what_is_section_describes_platform(self, readme_content):
        what_match = re.search(
            r"##\s+.*What is DevOps AtlasX.*?\n+([\s\S]+?)(?=\n## |\Z)", readme_content
        )
        assert what_match is not None
        section_text = what_match.group(1)
        assert "production" in section_text.lower(), (
            "'What is DevOps AtlasX' section must mention production use"
        )

    def test_why_section_lists_pain_points(self, readme_content):
        why_match = re.search(
            r"##\s+.*Why DevOps AtlasX.*?\n+([\s\S]+?)(?=\n## |\Z)", readme_content
        )
        assert why_match is not None
        section_text = why_match.group(1)
        # Should include concrete examples of problems
        assert "Kubernetes" in section_text or "CI/CD" in section_text or "pipeline" in section_text.lower(), (
            "'Why' section should list concrete DevOps pain points (Kubernetes, CI/CD, etc.)"
        )

    def test_how_helps_section_describes_workflow(self, readme_content):
        how_match = re.search(
            r"##\s+.*How This Helps You.*?\n+([\s\S]+?)(?=\n## |\Z)", readme_content
        )
        assert how_match is not None
        section_text = how_match.group(1)
        # Should describe an action-oriented workflow
        assert "fix" in section_text.lower() or "root cause" in section_text.lower(), (
            "'How This Helps You' section must describe fix/root-cause workflow"
        )

    def test_differentiation_section_contrasts_alternatives(self, readme_content):
        # Match from the H2 heading to the next H2 heading (not H3) or end of file.
        # Use "## " (with space) so that H3 headings ("### ") are NOT treated as section end.
        diff_match = re.search(
            r"##\s+.*What Makes It Different.*?\n+([\s\S]+?)(?=\n## |\Z)", readme_content
        )
        assert diff_match is not None
        section_text = diff_match.group(1)
        # Should compare against at least blogs, docs, or forums
        alternatives = ["Blogs", "Documentation", "Forums"]
        found = [alt for alt in alternatives if alt in section_text]
        assert len(found) >= 2, (
            "'What Makes It Different' must contrast at least 2 alternative resources; "
            f"found only: {found}"
        )

    def test_smart_search_describes_search_inputs(self, readme_content):
        search_match = re.search(
            r"###\s+.*Smart Search.*?\n+(.*?)(?=\n###|\n##|\Z)", readme_content, re.DOTALL
        )
        assert search_match is not None
        section_text = search_match.group(1)
        assert "Error messages" in section_text or "symptoms" in section_text.lower(), (
            "Smart Search section must describe what inputs can be searched"
        )

    def test_tool_organization_lists_categories(self, readme_content):
        org_match = re.search(
            r"###\s+.*Tool-Based Organization.*?\n+(.*?)(?=\n###|\n##|\Z)", readme_content, re.DOTALL
        )
        assert org_match is not None
        section_text = org_match.group(1)
        assert len(re.findall(r"^\*\s", section_text, re.MULTILINE)) >= 2, (
            "Tool-Based Organization section must list at least 2 tool categories"
        )

    def test_prevention_guidance_section_non_trivial(self, readme_content):
        prev_match = re.search(
            r"###\s+.*Prevention Guidance.*?\n+(.*?)(?=\n###|\n##|\Z)", readme_content, re.DOTALL
        )
        assert prev_match is not None
        section_text = prev_match.group(1).strip()
        assert len(section_text) > 20, (
            "Prevention Guidance section must contain meaningful content"
        )

    def test_sre_audience_spelled_out(self, readme_content):
        """SRE acronym should be expanded for clarity."""
        assert "Site Reliability Engineer" in readme_content, (
            "README must spell out 'Site Reliability Engineer' for clarity"
        )

    def test_project_name_consistent_casing(self, readme_content):
        """'DevOps AtlasX' must always appear with consistent casing."""
        # Allow for the canonical form only
        canonical = "DevOps AtlasX"
        # Find occurrences that look like the name but have wrong casing
        wrong_cases = re.findall(r"devops atlasX|DEVOPS ATLASX|Devops AtlasX", readme_content, re.IGNORECASE)
        wrong_cases = [w for w in wrong_cases if w != canonical]
        assert len(wrong_cases) == 0, (
            f"Project name casing inconsistency found: {wrong_cases}"
        )